import cron from 'node-cron';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Notification from '../models/Notification.js';

export const startCronJobs = (io) => {
  // Run every day at 8:00 AM server time
  cron.schedule('0 8 * * *', async () => {
    try {
      console.log('Running daily interview notification check...');
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Find jobs where interviewDate is today
      const jobsToday = await Job.find({
        interviewDate: {
          $gte: today,
          $lt: tomorrow
        }
      });

      let notificationsSent = 0;

      for (const job of jobsToday) {
        // Find applications for this job that are shortlisted
        const applications = await Application.find({
          jobId: job._id,
          currentStage: 'SHORTLISTED'
        });

        for (const app of applications) {
          // Check if a notification for this specific interview was already sent today to avoid duplicates
          const existingNotification = await Notification.findOne({
            recipient: app.studentId,
            relatedId: job._id,
            type: 'application',
            createdAt: {
              $gte: today,
              $lt: tomorrow
            }
          });

          if (!existingNotification) {
            const timeString = job.interviewTime ? ` at ${job.interviewTime}` : '';
            const notification = new Notification({
              message: `Reminder: Your interview for ${job.title} at ${job.company} is scheduled for today${timeString}!`,
              type: 'application',
              relatedId: job._id,
              recipient: app.studentId
            });
            
            await notification.save();
            notificationsSent++;

            // Emit socket event if user is online
            if (io) {
              io.to(app.studentId.toString()).emit('new_notification', notification);
            }
          }
        }
      }
      
      console.log(`Interview notification check completed. Sent ${notificationsSent} notifications for ${jobsToday.length} jobs.`);
    } catch (error) {
      console.error('Error running interview notification cron job:', error);
    }
  });
};

Jenkins Job status notifier
========================

Chrome plugin to show Jenkin's job statuses

Use-case
-----------------
As a lazy developer, I don't want to look at the build monitor or always login to Jenkin's dashboard page to know the statuses of the jobs.
Given I almost always have Chrome open, I want the browser to tell me when the currently configured jobs fail or a one-click link (icon near my address bar)
to tell me the job statuses.

### Popup showing job statuses ######

![Popup image](/images/popup_screenshot.png "Popup showing job statuses")


### Plugin configuration screen ######
![Plugin configuration image](/images/options_screenshot.png "Plugin configuration screen")


Steps to install
----------------

1. Clone the repository.
2. Navigate to chrome://extensions/
3. Enable Developer mode
4. Click on load unpacked extension
5. Select the folder where the repository is cloned to.

Post installation steps
-----------------------

1. Navigate to the options page.
2. Enter the Jenkin's server url.
3. Enter the user-name and API key (note: the user-name/api-key should have read permissions for Jenkin's jobs)
4. Polling frequency in minutes along with marking the check-box if you want to receive notifications for job failures.
5. Select the jobs to be monitored.
6. Finally click on update.



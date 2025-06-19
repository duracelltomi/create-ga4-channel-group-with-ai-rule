# Create new channel group in Google Analytics 4 with AI rule

A script to create a channel grouping in Google Analytics 4 with an AI ruleset.

## 🚫 Limitations

- **Google Apps Script runtime:**  
  Limited to 6 minutes.  
  https://developers.google.com/apps-script/guides/services/quotas

## ⚙️ Installation

1. **Use the same Google account for all steps.**

2. Go to the [Google Cloud Console](https://console.cloud.google.com/):
   - [Create a new project](https://developers.google.com/workspace/guides/create-project) or select an existing one.
   - Ensure [billing is enabled](https://cloud.google.com/billing/docs/how-to/modify-project) (this script will not incur extra costs).
   - [Enable the required APIs](https://cloud.google.com/endpoints/docs/openapi/enable-api), if not already enabled:
     - [Google Analytics Admin API](https://console.cloud.google.com/apis/api/analyticsadmin.googleapis.com/)
   - [Set up the OAuth consent screen](https://developers.google.com/workspace/guides/configure-oauth-consent) and add this scope:
     - `https://www.googleapis.com/auth/analytics.edit`

3. Go to [Google Apps Script](https://script.google.com/):
   - Click **New Project**.
   - Rename the project (e.g., _Generate AI rule in GA4 Channel Groups_).
   - Under **Google Cloud Platform (GCP) Project**, click **Change project** and enter your project **number** (not the ID). Find it on your [Google Cloud Dashboard](https://console.cloud.google.com/home/dashboard).
   - Copy all files from this repository into your Apps Script project.
   - Update script parameters at the top of the file (see below).

4. Run the script:
   - Manually run the `updateDefaultChannelGroupWithAIRule()` function in `main.gs`.
   - Grant the required permissions during the first run.

## 🔧 Parameters

You can change default parameters at the top of the script:

```js
/**
 * @type {string[]} An array of Google Analytics 4 Property IDs (e.g., '123456789').
 * Replace with your actual GA4 Property IDs.
 */
const GA4_PROPERTY_IDS = [
  'YOUR_GA4_PROPERTY_ID_1',
  'YOUR_GA4_PROPERTY_ID_2'
];

/**
 * The display name of the channel group that should contain the AI ruleset.
 * @type {string}
 */
const AI_GROUP_DISPLAY_NAME = "Default Channel Group with AI sources";

/**
 * The display name for the new rule to be added to the channel group defined in AI_GROUP_DISPLAY_NAME.
 * @type {string}
 */
const AI_RULE_DISPLAY_NAME = "AI";

/**
 * The regex used to define the AI channel group based on Source.
 * I've seen this regexp on variuos websites, I am not sure who was the original source.
 * Feel free to contact me tomi at jabjab dot hu to update this description.
 * @type {string}
 */
const AI_SOURCE_REGEX = ".*chatgpt.com.*|.*perplexity.*|.*edgepilot.*|.*edgeservices.*|.*copilot.microsoft.com.*|.*openai.com.*|.*gemini.google.com.*|.*nimble.ai.*|.*iask.ai.*|.*claude.ai.*|.*aitastic.app.*|.*bnngpt.com.*|.*writesonic.com.*|.*copy.ai.*|.*chat-gpt.org.*";
```

## 🙋 Support

This is an open-source project I created in my free time to give back to the community.  
Support is therefore limited, but you're welcome to open issues on the [Issues](../../issues) tab — response times may vary.

💡 PRs and suggestions are always welcome!

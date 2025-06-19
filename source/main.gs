/**
 * A script to create a channel grouping in Google Analytics 4 with an AI ruleset.
 * Can update an existing channel group or create a new one.
 * 
 * @author Thomas Geiger
 * @link https://www.linkedin.com/in/duracelltomi/
 * @link https://jabjab.hu/
 * @license GNU General Public License, version 3
 */

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

/**
 * Main function to iterate through specified GA4 properties and manage channel groups.
 * All output is directed to Logger.log().
 */
function updateDefaultChannelGroupWithAIRule() {
  let createdCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  if (GA4_PROPERTY_IDS.length === 0 || GA4_PROPERTY_IDS.includes('YOUR_GA4_PROPERTY_ID_1')) {
    Logger.log('⚠️ Configuration Error: Please update the GA4_PROPERTY_IDS array in the script with your actual property IDs before running.');
    Logger.log("⚠️ Script stopped due to configuration error.");
    return;
  }

  for (const propertyId of GA4_PROPERTY_IDS) {
    Logger.log(`➡️ Processing Property ID: ${propertyId}`);
    try {
      const aiUpdatedChannelGroup = getAIUpdatedChannelGroup(propertyId);
      if (!aiUpdatedChannelGroup) {
        Logger.log(`  ℹ️ Status: Updated channel group not found for property ${propertyId}. Attempting to create...`);

        const defaultChannelGroup = getDefaultChannelGroup(propertyId);
        if (!defaultChannelGroup) {
          Logger.log(` ⚠️ Warning: Default Channel Group not found for property ${propertyId}. Skipping.`);
          errorCount++; // Treat as an error or warning, as we can't proceed.
          continue;
        }

        const newGroupingRule = {
          "displayName": AI_RULE_DISPLAY_NAME,
          "expression": {
            "andGroup": {
              "filterExpressions": [{
                "orGroup": {
                  "filterExpressions": [{
                    "filter": {
                      "stringFilter": {
                        "value": AI_SOURCE_REGEX,
                        "matchType": "PARTIAL_REGEXP"
                      },
                      "fieldName": "eachScopeSource"
                    }
                  }]
                }
              }]
            }
          },
        };

        const newRules = defaultChannelGroup.groupingRule ? [...defaultChannelGroup.groupingRule] : [];
        
        newRules.unshift(newGroupingRule);

        const newChannelGroupPayload = {
          displayName: AI_GROUP_DISPLAY_NAME,
          description: "Custom channel group including AI traffic sources.",
          groupingRule: newRules
        };

        const parent = `properties/${propertyId}`;
        AnalyticsAdmin.Properties.ChannelGroups.create(newChannelGroupPayload, parent);

        Logger.log(` ✅ Status: Successfully created new channel group for property ${propertyId}.`);
        createdCount++;
      } else {
        Logger.log(` ✅ Status: Updated channel group already exists for property ${propertyId}. Skipping update.`);
      }
    } catch (e) {
      Logger.log(` ⚠️ Error: An error occurred for Property ID ${propertyId}: ${e.message}`);
      errorCount++;
    }
    Logger.log(`✅ Finished processing Property ID: ${propertyId}`);
  }

  const resultMessage = `Script execution complete.\n\n` +
                        `Summary:\n` +
                        `  New Channel Groups created: ${createdCount}\n` +
                        `  Skipped (AI rule already existed): ${skippedCount}\n` +
                        `  Errors encountered: ${errorCount}`;
  Logger.log(resultMessage);
}

/**
 * Retrieves the "Default Channel Group" for a given Google Analytics 4 property.
 * 
 * @param {string} propertyId The ID of the GA4 property.
 * @returns {GoogleAppsScript.AnalyticsAdmin.Schema.GoogleAnalyticsAdminV1alphaChannelGroup | null} The Default Channel Group object, or null if not found.
 */
function getDefaultChannelGroup(propertyId) {
  const parent = `properties/${propertyId}`;
  
  // Use correct casing for AnalyticsAdmin.Properties.ChannelGroups.list
  const response = AnalyticsAdmin.Properties.ChannelGroups.list(parent);
  const channelGroups = response.channelGroups || [];

  for (const group of channelGroups) {
    // Check for display name AND systemDefined === true

    if (group.systemDefined === true) {
      Logger.log(`Found system-defined Default Channel Group: ${group.name}`);
      return group;
    }
  }
  Logger.log(`System-defined Default Channel Group not found for property ${propertyId}.`);
  return null;
}

/**
 * Retrieves the updated channel group for a given Google Analytics 4 property if it exists.
 * 
 * @param {string} propertyId The ID of the GA4 property.
 * @returns {GoogleAppsScript.AnalyticsAdmin.Schema.GoogleAnalyticsAdminV1alphaChannelGroup | null} The Channel Group object, or null if not found.
 */
function getAIUpdatedChannelGroup(propertyId) {
  const parent = `properties/${propertyId}`;
  
  // Use correct casing for AnalyticsAdmin.Properties.ChannelGroups.list
  const response = AnalyticsAdmin.Properties.ChannelGroups.list(parent);
  const channelGroups = response.channelGroups || [];

  for (const group of channelGroups) {
    // Check for display name AND systemDefined === true
    if (AI_GROUP_DISPLAY_NAME === group.displayName) {
      return group;
    }
  }

  return null;
}

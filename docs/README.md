### [NeatQueue Website](https://www.neatqueue.com)

# Introduction

All NeatQueue commands are slash commands, which means they are invoked using a `/` \
Any Admin command requires the user to have Manage Channels permissions, or have one of the configured NeatQueue staff roles. \
In this documentation, anytime an argument is surrounded by [square brackets], it is a required argument. If it is surrounded by (parenthesis), it is optional. \
The term MMR stands for Match Making Rating, which corresponds to the hidden rating system used by most competitive games.  \
All commands are queue specific unless otherwise stated.

### How stats for a queue are linked"
> In NeatQueue, player stats are stored via a unique name. This lets you link queues together for sharing stats, or separating across queues (Example: Rocket League Queue and Overwatch Queue both have independent stats)."
> 1) If `/leaderboardconfig sharedstats serverwide` is enabled, that is the unique name that is used for all queues, so all queues see the same stats."
> 2) Otherwise, if `/leaderboardconfig sharedstats set` is set, that is the unique name to use for just this channel's queue. Any queue with this same unique stats name will see the same stats."
> 3) Otherwise, the queue name is used as the unique name."
**By default, all stats are tied to the queue name. This means if you create multiple queues with the same queue name, they will share stats.**


<hr style="border:3px solid gray">

# Quick Start

## Starting a Queue
Starting a queue is super simple with NeatQueue, just run one of the following commands:
#### `/setup` for an interactive walk through
#### `/startqueue` for a simple default configuration
#### `/load [config_id]` for a specific queue configuration


<hr style="border:3px solid gray">

# Premium Commands
## Bot Customization
### `/bot avatar`
#### Description
 Set the bot's avatar.
#### Usage: `/bot avatar (file)`
#### Arguments:
`file`: *(Optional)* The new avatar for the bot, omit to reset.
>Updates the bot's avatar by uploading the supplied image to Discord's avatar endpoint and assigning it to the bot account. Restricted to administrators, this is commonly used for branding, seasonal themes, or event-specific visuals; note that Discord enforces file format and size limits and CDN caching can cause brief delays before the new avatar appears everywhere.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/bot banner`
#### Description
 Set the bot's banner.
#### Usage: `/bot banner (file)`
#### Arguments:
`file`: *(Optional)* The new banner for the bot, omit to reset.
>Sets the bot's banner image by accepting an uploaded image, validating supported formats and dimensions, and replacing the active banner displayed by the bot. Commonly used for server branding or seasonal themes; note that images must meet format/size constraints, may be resized or cropped during validation, changes can take a short time to propagate, and the action is restricted to administrators.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/bot bio`
#### Description
 Set the bot's bio.
#### Usage: `/bot bio (bio)`
#### Arguments:
`bio`: *(Optional)* The new bio for the bot, omit to reset.
>Updates the bot's visible bio text, replacing the current profile description with the provided content and immediately reflecting the change across the server. Performs length and content validation and sanitization, enforces admin-only permission checks, and is commonly used to publish event notices, maintenance messages, or branding updates while avoiding excessive formatting or disallowed mentions.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/bot nickname`
#### Description
 Set the bot's nickname.
#### Usage: `/bot nickname (name)`
#### Arguments:
`name`: *(Optional)* The new nickname for the bot, omit to reset.
>Sets the bot's nickname for the guild by updating its server display name so the new name appears in member lists, mentions, and message author labels. Restricted to administrators, this is commonly used for branding, clarifying the bot's role in specific channels, or temporarily signaling status; note that Discord's nickname length and character restrictions apply and the change affects the bot's display across the entire server.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Language
### `/language overrides set`
#### Description
 Toggle on/off using the custom overrides.
#### Usage: `/language overrides set [original_phrase] (overriden_phrase)`
#### Arguments:
`original_phrase`: *(Required)* Existing phrase to override.\
`overriden_phrase`: *(Optional)* Replacement phrase, omit to go back to default.
>Enables or disables custom phrase overrides for bot responses, replacing a specified default phrase with an alternate text while the override is active and reverting to the original when the override is cleared. Intended for administrators to tailor or correct wording across the server—common uses include fixing typos, localizing terms, or enforcing style—and note that removing an override immediately restores the original phrase.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/language overrides toggle`
#### Description
 Toggle on/off using the custom overrides.
#### Usage: `/language overrides toggle [toggle]`
#### Arguments:
`toggle`: *(Required)* Toggle custom overrides.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`
>Toggles the application of custom language overrides on or off, immediately enabling or disabling how override rules influence language selection across the server. Intended for administrators to quickly enable overrides for testing or disable them to revert to default behavior; the change flips an internal flag so subsequent language processing will include or ignore the overrides right away.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/language overrides upload`
#### Description
 Upload a custom overrides file.
#### Usage: `/language overrides upload [custom_overrides]`
#### Arguments:
`custom_overrides`: *(Required)* Custom translation overrides, omit to remove.
>The overrides file is JSON format, and can be found here: https://www.neatqueue.com/default_overrides.json
> The keys (left side) signify the already existing English phrase the bot uses. The value (right side) is the
> value that replaces the key.
> 
> Sometimes an entry will include special charcters similar to {}. The total number of these signifiers in each
> entry must remain constant. If an override does not match the count of signifiers, it will not be used.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Leaderboard Config
>Leaderboard titles are hyperlinks to the website version of the leaderboard.
### `/leaderboardconfig url`
#### Description
 Create a custom website url for leaderboards.
#### Usage: `/leaderboardconfig url [url]`
#### Arguments:
`url`: *(Required)* Custom url for this channel's leaderboard.
>Configures the queue's leaderboard website URL used in leaderboard displays and links, replacing the default or previous address. Intended for administrators to point leaderboard outputs to a custom external site for branding or third‑party integration; changes take effect immediately for subsequent leaderboard displays.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Messages + Styling
### `/message color`
#### Description
 Sets the color for all embeds and/or buttons in messages.
#### Usage: `/message color (color) (button_color)`
#### Arguments:
`color`: *(Optional)* Either a color by name, or by HEX value (Ex: 00FF55).\
`button_color`: *(Optional)* Button color name.\
&emsp;&emsp;&emsp; Options: `Blurple, Gray, Green, Red, Random`
>Configures the default color scheme for message embeds and interactive buttons across the bot's output, allowing embed and button colors to be set independently. Internally it updates the bot's color settings so future messages render with the selected embed color and button styles, and is restricted to administrators to preserve consistent server branding and prevent unauthorized visual changes.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/message queuemessage footer`
#### Description
 (Default: None) Set a footer for the queue message.
#### Usage: `/message queuemessage footer (text) (icon_url)`
#### Arguments:
`text`: *(Optional)* Footer contents, or omit to remove.\
`icon_url`: *(Optional)* 
>Updates the queue announcement's embed footer and optional icon, modifying the existing queue message in place to display attribution, status notes, or channel-specific branding. Restricted to administrators, this operation replaces or clears the footer without altering other message content and can include a small image as the footer icon.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/message queuemessage image`
#### Description
 (Default: None) Set an image for the queue message.
#### Usage: `/message queuemessage image (image_url)`
#### Arguments:
`image_url`: *(Optional)* Direct URL of image, or omit to remove.
>Sets or clears the image displayed on the queue message by updating the embed to reference a direct image URL or by removing the embed image. Commonly used to brand the queue with server artwork or event banners and to remove outdated visuals; restricted to server administrators to prevent unauthorized changes.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/message queuemessage thumbnail`
#### Description
 (Default: None) Set a thumbnail for the queue message.
#### Usage: `/message queuemessage thumbnail (image_url)`
#### Arguments:
`image_url`: *(Optional)* Direct URL of image, or omit to remove.
>Sets a thumbnail image for the queue message by attaching the provided image URL to the queue embed so a visual preview appears alongside the queue content. Intended for administrators to brand queues, highlight featured items, or add contextual imagery; note the image must be publicly accessible and will be validated before being embedded, with invalid or unreachable URLs rejected.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Select Winner
### `/outcome autoresolution setup`
#### Description
 Run a setup wizard to configure AI auto resolution and stat parsing.
#### Usage: `/outcome autoresolution setup`

>Launches an interactive setup wizard that guides server administrators through enabling and configuring AI auto-resolution and stat parsing, presenting each configurable option, validating selections, and previewing effects before applying them. Intended for initial setup, post-update reconfiguration, or troubleshooting automated resolution and stat collection; requires administrator privileges and confirms required permissions before committing changes.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/outcome autoresolution toggle`
#### Description
 Toggle auto resolution for the current queue.
#### Usage: `/outcome autoresolution toggle [toggle]`
#### Arguments:
`toggle`: *(Required)* If auto resolution is enabled or disabled.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`
>Toggles automatic resolution for the current queue, causing the bot to automatically mark parties as resolved when the queue’s resolution conditions are met or to require manual resolution when turned off. Commonly used to streamline high-traffic sessions or to prevent unintended closures during special events; note that only administrators can change this setting and the change takes effect immediately.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

# User Commands
## Cancel
### `/cancel`
#### Description
Start a vote to cancel the current match.
#### Usage: `/cancel`

>Removes the invoking user's active spot from the queue, recalculates positions for remaining participants, and posts a confirmation with the updated queue state to the channel. Commonly used when a user can no longer wait or moderators need to clear inactive entries; cancellations take effect immediately and cannot be auto-reversed, so users must rejoin if they change their mind.

<hr style="border:3px solid gray">

## Compare
### `/compare`
#### Description
Compare your stats to the given player.
#### Usage: `/compare [player2] (player1) (hidden)`
#### Arguments:
`player2`: *(Required)* Enter the second user you want to compare to.\
`player1`: *(Optional)* Enter the first user you want to compare to, or omit for yourself.\
`hidden`: *(Optional)* If you want the stats to be hidden.
>Displays a side-by-side comparison of two users' queue statistics and performance metrics, computing deltas and highlighting strengths and weaknesses to make relative skill and ranking immediately clear. Commonly used to settle player debates, evaluate opponent matchups, or monitor progression; comparisons can be shown privately to the requester and will gracefully handle missing or ambiguous users by resolving to the most relevant profile.

<hr style="border:3px solid gray">

## Force Start
### `/forcestart`
#### Description
Start a vote to forcestart the game, skips vote if used by staff.
#### Usage: `/forcestart`

>Initiates a vote among players in the queue to force the match to start early, immediately bypassing the vote when executed by a staff member. Commonly used to end long waits or unstuck stalled queues, the action notifies participants and only proceeds if the required number of affirmative votes from present players is reached (unless invoked by staff).

<hr style="border:3px solid gray">

## Help
### `/help`
#### Description
View locations where to find help for setup.
#### Usage: `/help`

>Displays a consolidated list of available bot commands with concise descriptions and organizes them into readable sections, delivered as an embedded message to the invoking channel or direct message. It compiles each command's metadata and groups entries by category so users can quickly discover capabilities, check required permissions, and identify commands relevant to common tasks like queue management or moderation. Important notes: the response adapts to the caller's permissions and server context so only accessible commands are shown.

<hr style="border:3px solid gray">

## Leaderboard
### `/leaderboard`
#### Description
Shows the leaderboard for the current queue's game.
#### Usage: `/leaderboard (page) (type) (queue_name)`
#### Arguments:
`page`: *(Optional)* The desired page number.\
`type`: *(Optional)* The type of leaderboard to display.\
`queue_name`: *(Optional)* The queue name to view.
>Displays a ranked leaderboard for the active game queue, compiling player standings and key metrics such as MMR, peak MMR, points, MVPs, games, wins, losses, winrate, and streaks. Results are sortable by metric and paginated for easy browsing, and can target a specific queue when inspecting non-active queues. Useful for comparing player performance, tracking seasonal peaks and streaks, and resolving ranking disputes.

<hr style="border:3px solid gray">

## Need
### `/need`
#### Description
Shows how many players are needed for the queue.
#### Usage: `/need (channel)`
#### Arguments:
`channel`: *(Optional)* Channel of queue to show need for.
>Reports how many additional players are required to reach a full match by comparing the queue's current participant count to its target group size, providing a concise numeric result and role-based breakdown when relevant. Commonly used by match coordinators and pickup organizers to identify shortfalls before starting games; it returns zero when a queue is full and a positive count to indicate how many players need to be recruited.

<hr style="border:3px solid gray">

## Parties/Teams/Clans/Groups
### `/party cancelinvites`
#### Description
CAPTAIN ONLY: Cancel all pending invites.
#### Usage: `/party cancelinvites [party_name]`
#### Arguments:
`party_name`: *(Required)* The party name.
>Cancels all pending invitations for the specified party, preventing invited users from joining via those invites. Commonly used by a party captain to reset or close recruitment after roster changes; this action is restricted to the captain and is immediate and irreversible, so confirm the target party before executing.

---

### `/party captain`
#### Description
CAPTAIN ONLY: Designate a new captain if you are the current one.
#### Usage: `/party captain [player] [party_name]`
#### Arguments:
`player`: *(Required)* The new captain.\
`party_name`: *(Required)* The team name.
>Transfers captain privileges for a party from the issuing captain to another specified player after verifying the issuer’s captain status and the target’s membership in that party. Commonly used when stepping down, reallocating leadership, or resolving team changes; it updates party leadership, notifies affected members, and rejects attempts by non-captains or when the target player is not part of the party.

---

### `/party clear`
#### Description
CAPTAIN ONLY: Remove all members from the party except the captain.
#### Usage: `/party clear [party_name]`
#### Arguments:
`party_name`: *(Required)* The party name.
>Removes all non-captain members from the specified party, leaving the captain and party intact while freeing member slots. Intended for captains who need to quickly reset a roster before recruiting or closing an event; the action is restricted to the captain and preserves captain ownership and existing party settings.

---

### `/party create`
#### Description
Create a new party.
#### Usage: `/party create [party_name]`
#### Arguments:
`party_name`: *(Required)* The party name.
>Creates a new party in the queue with the given name, reserving a spot and initializing the party’s state so it can be listed, moved, or removed by subsequent queue actions. Commonly used to register groups before an event or session and to let hosts manage party order; note that names should be unique within the server and duplicate or empty names may be rejected.

---

### `/party disband`
#### Description
CAPTAIN ONLY: Disband a party.
#### Usage: `/party disband [party_name]`
#### Arguments:
`party_name`: *(Required)* The party name.
>Disbands the specified party, removing its membership and any pending invites while notifying the captain and all members that the group has been closed. Restricted to the party captain and irreversible through normal commands; members are released and may join or create other parties afterward.

---

### `/party invite`
#### Description
CAPTAIN ONLY: Invite a new player to the party.
#### Usage: `/party invite [player] [party_name]`
#### Arguments:
`player`: *(Required)* Player to invite.\
`party_name`: *(Required)* The party name.
>Invites a specified user to join a named party, performing a captain-only action that initiates an invitation workflow. Checks that the issuer holds captain permissions and that the target isn't already a member, then posts notifications to the invitee and the party so everyone is informed. Commonly used by captains to recruit or replace members on an active party; the action will fail if permissions are insufficient or the party name is invalid.

---

### `/party join`
#### Description
Join a party.
#### Usage: `/party join [party_name]`
#### Arguments:
`party_name`: *(Required)* The party name.
>Adds the invoking user to the specified party's participant roster and assigns them the next available position in that party's queue, recording their join time and updating visible participant lists. Confirms success or reports if the user is already a member or the party name is invalid, making it useful for joining active sessions, event queues, or collaborative groups.

---

### `/party kick`
#### Description
CAPTAIN ONLY: Kick a player from the party.
#### Usage: `/party kick [player] [party_name]`
#### Arguments:
`player`: *(Required)* The player to kick.\
`party_name`: *(Required)* The team name.
>Removes a specified player from the indicated party, updates the party roster, and notifies the removed player and remaining members of the change. Only the party captain can perform this action; it enforces captain permissions, rejects attempts when the caller lacks authority or the target is not a member, and ensures the party view reflects the removal.

---

### `/party leave`
#### Description
Leave a party.
#### Usage: `/party leave [party_name]`
#### Arguments:
`party_name`: *(Required)* The party name.
>Removes the invoking user from the specified party, clearing their membership and any positions they held in the party's queue. Notifies remaining members and the party leader of the departure and updates the party roster and queue order so play and invitations continue smoothly; if the user was the last member, the party is dissolved.

---

### `/party list`
#### Description
List your parties.
#### Usage: `/party list`

>Displays a concise, ordered list of the parties you own or participate in, showing key details such as status (open/closed), member count, and scheduled time. Aggregates your party entries and presents them in a readable format sorted by relevance or upcoming time, enabling quick checks for parties needing more members, confirming start times, or locating specific rosters.

---

### `/party selectrole`
#### Description
Specify your role in the party.
#### Usage: `/party selectrole [party_name] [role]`
#### Arguments:
`party_name`: *(Required)* The party name.\
`role`: *(Required)* Your role.
>Assigns the user's chosen role within a specified party and updates the party roster so other members and the organizer immediately see the selection. Commonly used to claim responsibilities before events, resolve duplicate-role conflicts, and trigger availability and consistency checks that notify party members of any changes.

---

### `/party view`
#### Description
View the specified party.
#### Usage: `/party view [party_name]`
#### Arguments:
`party_name`: *(Required)* The party name.
>Displays a comprehensive summary of a specified party, compiling its name, current members, member statuses, and the party's position in the queue into a clear, readable output. Commonly used to verify rosters and readiness before events or to locate a party in the queue; if the specified party cannot be found or has no members, returns an informative notification indicating that status.

<hr style="border:3px solid gray">

## Ping
### `/ping`
#### Description
Pings all members in the queue.
#### Usage: `/ping`

>Reports the bot's current responsiveness by measuring message round-trip latency and the Discord API heartbeat, presenting both values so users can distinguish network delay from bot processing time. Useful for verifying connectivity, troubleshooting perceived lag, or confirming the bot is online; note that values are a momentary snapshot and can fluctuate with transient network conditions.

<hr style="border:3px solid gray">

## Predictions
### `/predict`
#### Description
Place a bet on the given team for the specified match number.
#### Usage: `/predict [gamenumber] [team] [amount]`
#### Arguments:
`gamenumber`: *(Required)* Game number of bet on.\
`team`: *(Required)* Team to place the bet on.\
`amount`: *(Required)* Amount of points you want to bet.
>Places a wager on a chosen team for a specified match, immediately deducting the staked points from the user's balance and registering the bet for automated settlement. It validates the match and team selection, ensures sufficient points and any betting limits are respected, and locks the wager to be settled when the match result is finalized.

<hr style="border:3px solid gray">

## Register

### `/register`
#### Description
Initialize your MMR using your account.
#### Usage: `/register [account]`
#### Arguments:
`account`: *(Required)* Account details.
>Initializes your MMR by retrieving the current rank from the specified game account and associating that rank with your Discord identity for queue placement and matchmaking. Commonly used when first joining or after a rank change to synchronize visible MMR; ensure the target account is valid and accessible so the bot can obtain accurate ranking information.

<hr style="border:3px solid gray">

## Require IGN
### `/ign`
#### Description
Sets your IGN for this queue to help with easy lobby setup.
#### Usage: `/ign [ign]`
#### Arguments:
`ign`: *(Required)* Your IGN for this queue's platform.
>Associates your in-game name with your Discord account for the active queue platform so organizers and other participants can identify and contact you. Commonly used to provide a platform-specific identifier for match invites and team assignment; submitting a new name replaces the previous entry, so keep it accurate and platform-specific to avoid misidentification.

<hr style="border:3px solid gray">

## Roles
### `/role`
#### Description
Set your role.
#### Usage: `/role (role)`
#### Arguments:
`role`: *(Optional)* Preferred role to use, or omit to remove.

<hr style="border:3px solid gray">

## Stats
### `/stats`
#### Description
Shows your stats.
#### Usage: `/stats (hidden) (user) (all_time)`
#### Arguments:
`hidden`: *(Optional)* If you want the stats to be hidden.\
`user`: *(Optional)* The user you want to check stats of.\
`all_time`: *(Optional)* If you want to view all time stats, only applies to monthly queues.
>Displays a user's queue participation and performance metrics, summarizing recent monthly activity or aggregating across all time and optionally delivering the report privately. Commonly used to track position history, participation counts and completion rates for personal progress or moderation review; monthly views default to the current period unless an all-time aggregation is requested.

<hr style="border:3px solid gray">

## Substitute

### `/substitute`
#### Description
Substitute yourself for the given player.
#### Usage: `/substitute [player]`
#### Arguments:
`player`: *(Required)* Enter the player to replace you.
>Replaces your position in the active queue with that of a specified participant, causing you to assume their slot, turn order, and any team or match assignments. Useful for covering absent players or swapping roles quickly; the substitution takes effect immediately, updates the queue order, and may notify affected users so subsequent match flow proceeds with the new assignment.

<hr style="border:3px solid gray">

# Admin Commands
## AnonymousQueue / Hiding Names
### `/anonymousqueue`
#### Description
 Sets whether to hide the names of players in queue.
#### Usage: `/anonymousqueue [mode]`
#### Arguments:
`mode`: *(Required)* Hide players names in queue.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`
>Toggles the visibility of player names in the queue, switching display between anonymized placeholders and full usernames. When enabled, queue entries show generic identifiers to protect privacy; when disabled, the queue displays each player's actual Discord name, and the chosen state applies immediately to all queue views until changed. Requires administrator privileges and is intended for privacy control during public or competitive sessions.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Anti Cheat
### `/anticheat channel`
#### Description
 Sets the anticheat channel to show flagged users.
#### Usage: `/anticheat channel [channel]`
#### Arguments:
`channel`: *(Required)* The desired anticheat channel.
>Configure the anticheat channel where the bot will publish flagged-user alerts and moderation notices. Intended for administrators to centralize monitoring—point it at a private moderator channel for discreet review or a public alerts channel for visible notifications. Note that the bot must have permission to post in the selected channel and that the change only affects where future flag notifications appear (existing messages remain in the previous channel).
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/anticheat enable`
#### Description
 Enable/disable the anticheat system.
#### Usage: `/anticheat enable [toggle]`
#### Arguments:
`toggle`: *(Required)* Toggle for anticheat.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`
>Toggles the anticheat system between enabled and disabled states, immediately activating or suspending automated cheat detection, alerts, and enforcement across the server. Intended for administrators to quickly enable protection during live events or re-disable it for maintenance or testing; changes take effect instantly and alter how the bot monitors and responds to suspicious activity.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/anticheat flag incorrectvoting`
#### Description
 Set an anticheat trigger for players who vote for the wrong team.
#### Usage: `/anticheat flag incorrectvoting [toggle]`
#### Arguments:
`toggle`: *(Required)* Flag users who vote wrong.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`
>Enables monitoring that detects when a player's vote conflicts with their current team assignment by watching vote events and comparing the chosen side to the player's team, flagging them as a potential anticheat trigger on mismatch. Intended for administrators to catch intentional sabotage or griefing, it surfaces suspicious voters for review or automated action but can produce false positives during team swaps, late joins, or legitimate vote changes, so flagged cases should be reviewed before punitive measures.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/anticheat flag newaccount`
#### Description
 Set an anticheat trigger for new accounts.
#### Usage: `/anticheat flag newaccount [age]`
#### Arguments:
`age`: *(Required)* Account age in days.
>Sets an anti-cheat trigger that flags accounts younger than a specified age, causing them to be treated as suspicious by the server's moderation checks. Commonly used by administrators to reduce smurfing, bot raids, and rapid account abuse by enforcing a minimum account age; choose conservative thresholds to minimize false positives against legitimate new users. Only server administrators can configure this setting, and changes apply immediately to how new joiners are evaluated.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/anticheat flag rejoins`
#### Description
 Set an anticheat trigger for if a player rejoins a server.
#### Usage: `/anticheat flag rejoins [toggle]`
#### Arguments:
`toggle`: *(Required)* Flag users who rejoin the server if they already have stats.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`
>Toggles an administrator-only anticheat trigger that monitors player join events and flags players who rejoin the same server within a short timeframe. Use this to detect reconnect-based abuse (for example rapid reconnects to manipulate queue position or evade checks) and surface suspicious repeat-join behavior for moderator review and action.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/anticheat flag streak`
#### Description
 Set an anticheat trigger for a players streak.
#### Usage: `/anticheat flag streak [streak]`
#### Arguments:
`streak`: *(Required)* Streak to trigger a flag.
>Sets an anticheat trigger that flags players when they reach a specified consecutive-win streak; the bot continuously monitors player streaks and emits an alert or executes the configured anticheat response once the threshold is crossed. Intended for administrators to detect suspicious hot streaks and automatically mark or queue players for review; choose thresholds carefully to minimize false positives and operational noise.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/anticheat role`
#### Description
 Set a role to assign to flagged players.
#### Usage: `/anticheat role [role]`
#### Arguments:
`role`: *(Required)* Role to assign.
>Assigns a specified server role to players who are flagged, automatically granting or updating that role whenever a player’s flagged status changes. Commonly used to visibly mark flagged players for moderation, apply restricted-access roles (for example, "Flagged" or "Muted"), or route notifications to moderators; this action is restricted to administrators so only authorized staff can change which role is applied.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Auto Ping
### `/autoping remove`
#### Description
 Remove the set auto ping rule.
#### Usage: `/autoping remove`

>Removes a staff role's access to a specific bot command, revoking that role's ability to execute the command until access is restored. Restricted to administrators, the change takes effect immediately and prevents members with that role from invoking the command; use cases include rescinding moderator privileges, limiting command use during special events, or pruning outdated role permissions.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/autoping set`
#### Description
 Automatically ping the given role when the queue hits the given size.
#### Usage: `/autoping set [role] [size] (delete_after)`
#### Arguments:
`role`: *(Required)* Role to ping.\
`size`: *(Required)* Ping when the queue hits this size.\
`delete_after`: *(Optional)* Delete the ping after this many seconds.
>Notifies a specified role when the queue reaches a configured size by monitoring the queue length and issuing a role mention as soon as the threshold is reached. Optionally removes the notification after a set interval to reduce clutter, and is restricted to administrators to prevent misuse; common uses include alerting staff to growing backlogs or coordinating shift handoffs.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Balance By
### `/balanceby roles`
#### Description
 Order of role to skill from lowest to highest rated, used if balance by ROLES, not MMR.
#### Usage: `/balanceby roles (role1) (role2) (role3) (role4) (role5) (role6) (role7) (role8) (role9) (role10)`
#### Arguments:
`role1`: *(Optional)* The role to use in balancing.\
`role2`: *(Optional)* The role to use in balancing.\
`role3`: *(Optional)* The role to use in balancing.\
`role4`: *(Optional)* The role to use in balancing.\
`role5`: *(Optional)* The role to use in balancing.\
`role6`: *(Optional)* The role to use in balancing.\
`role7`: *(Optional)* The role to use in balancing.\
`role8`: *(Optional)* The role to use in balancing.\
`role9`: *(Optional)* The role to use in balancing.\
`role10`: *(Optional)* The role to use in balancing.
>Configures the ranked ordering of server roles from lowest to highest skill so the queue balancer uses role-based skill mapping instead of MMR when forming teams. Intended for administrators to define up to twenty role tiers for role-based balancing; ensure the list reflects true low-to-high skill order and avoid omissions or duplicates because incorrect ordering can produce skewed or unfair team assignments.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/balanceby type`
#### Description
 (Default: mmr) Sets how teams are balanced.
#### Usage: `/balanceby type [mode]`
#### Arguments:
`mode`: *(Required)* How teams are balanced.\
&emsp;&emsp;&emsp; Options: `Roles, MMR`
>Configures the queue's team-balancing and MMR-calculation mode for admins, switching between role-based and MMR-based balancing and between Per Player and Per Team MMR change calculations. In MMR mode teams are formed to minimize overall MMR disparity while Roles mode prioritizes player roles; note that MMR multipliers are still applied on a per-player basis even when Per Team scaling is selected, so disable multipliers to make every teammate receive the same MMR change.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Best Of
### `/bestof`
#### Description
 Sets whether the queue is a best of 3, 5, 7, etc.
#### Usage: `/bestof [number] (vote) (voteselection) (eligible_voters)`
#### Arguments:
`number`: *(Required)* Best of number.\
`vote`: *(Optional)* Whether players can vote on the number of matches to play.\
`voteselection`: *(Optional)* Whether to pick the majority vote, or the lowest voted number.\
&emsp;&emsp;&emsp; Options: `Majority, Lowest`\
`eligible_voters`: *(Optional)* Who on the team can vote. Defaults to All if no captain selected.\
&emsp;&emsp;&emsp; Options: `All, Captains`
>Configures the queue to require matches be played as a best-of-N series and enforces that series length for match scheduling and progression; only administrators can change this setting. When voting is enabled, eligible players submit votes to determine the series length and the bot resolves the result according to the selected resolution method (majority or lowest-vote), with voting eligibility limited to either all players or captains as specified.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Captain Selection
### `/captains automute`
#### Description
 Automatically mute all non-captains during selection to remove bias.
#### Usage: `/captains automute [toggle]`
#### Arguments:
`toggle`: *(Required)* If players are muted.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`
>Automatically mutes all non-captain members during team selection rounds to remove spectator influence by applying server-side voice mutes to users who do not hold the configured captain role while leaving captains able to speak. Accessible only to administrators, it can be toggled on or off to enforce silence during organized picks and tournaments, and administrators should ensure the bot has permission to mute members and that captain roles are correctly assigned.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/captains bannedrole`
#### Description
 Sets a role which is banned from being captain.
#### Usage: `/captains bannedrole (role)`
#### Arguments:
`role`: *(Optional)* The banned role.
>Marks a specified server role as ineligible for captain selection, preventing any members who hold that role from being assigned captain during team-pick operations. Intended for admins to exclude staff, bots, or restricted groups from captain duties; the restriction applies to future captain assignments and remains in effect until changed by an admin.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/captains drafttype`
#### Description
 Sets the type of draft to either Snake or Straight.
#### Usage: `/captains drafttype [type]`
#### Arguments:
`type`: *(Required)* The type of draft to use.\
&emsp;&emsp;&emsp; Options: `Snake (1-2-2-2), Straight (1-1-1-1), Hybrid (1-1/2-1-1), Hybrid 2 (1-2-1-1), Vote`
>Sets the draft sequencing mode for the lobby, switching between Snake, Straight, Hybrid, and Vote patterns to control pick order across rounds. The selected mode immediately determines how turns are generated—Snake reverses the pick order each round, Straight preserves the same order, and Hybrid variants apply mixed reversal patterns—so draft flow matches the chosen league or event format. Restricted to administrators to prevent accidental changes and ensure consistent drafting rules.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/captains firstpick`
#### Description
 Specify who gets the first pick in captain selection.
#### Usage: `/captains firstpick [mode]`
#### Arguments:
`mode`: *(Required)* Who gets the first pick.\
&emsp;&emsp;&emsp; Options: `Highest Rated, Lowest Rated, Random`
>Sets which captain receives the first pick during captain selection, determining the initial pick order for the current session. Switches the selection process among predefined modes and applies the chosen order immediately—commonly used by admins to enforce fair rotations or tournament rules; changes override prior settings and affect the active selection round.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/captains reshuffle`
#### Description
 Sets whether players can reshuffle captains in random captain selection.
#### Usage: `/captains reshuffle [toggle]`
#### Arguments:
`toggle`: *(Required)* Whether reshuffling is enabled or disabled.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`
>Configures whether players can reshuffle captains during random captain selection; when enabled, participants may trigger a reshuffle to generate a new random set of captains, and when disabled any reshuffle attempts are rejected. Restricted to administrators, this setting is useful to enforce a final captain assignment for competitive matches or to allow rerolls when players need a fresh random draw.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/captains role`
#### Description
 Sets a role which gets priority for being captain.
#### Usage: `/captains role (role)`
#### Arguments:
`role`: *(Optional)* The captain role.
>Grants priority for captain selection to members who possess the specified Discord role, causing those members to be preferred when captains are chosen. Commonly used to prioritize officers, moderators, or veteran players in pick orders; because the action is restricted to administrators, changes take effect immediately and prevent accidental reassignment.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/captains selection`
#### Description
 Choose how captains will be picked.
#### Usage: `/captains selection`

>Configures how captains are selected for upcoming queues by setting the selection mode (e.g., random, draft, highest-ranked, or community vote). Changes take effect for subsequent queues and persist until changed, letting admins switch to random for casual play, draft for competitive matches, or vote when player choice is desired; this setting is restricted to administrators to avoid accidental changes.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Channel Config
>Due to Discord API limitations, NeatQueue can only update the channel name twice per a 10 minute period.
### `/channel category`
#### Description
 (Default: Parent) Sets whether created channels go in a separate or the parent category.
#### Usage: `/channel category [category_mode] (category)`
#### Arguments:
`category_mode`: *(Required)* The category setting. If mode is Specified, you must provide the category.\
&emsp;&emsp;&emsp; Options: `Parent, New, Specified`\
`category`: *(Optional)* The specific category if category_mode is Specified.
>Configures where newly created channels are placed by selecting whether they inherit the server's parent category, are created in a separate new category, or are assigned to a specific existing category. Commonly used to keep queue channels visible in the main category, isolate them in a dedicated area for moderation, or group them into an admin-designated category; this action requires administrator privileges and the target category (when chosen) must already exist and be accessible.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/channel name queueempty`
#### Description
 Set the channel name when a queue is empty. Can only be updated twice per 10 minutes!.
#### Usage: `/channel name queueempty [channel_name]`
#### Arguments:
`channel_name`: *(Required)* The channel name.
>Updates the channel name shown when a queue is empty, letting administrators present a custom idle status for that channel and enforcing a hard limit of two name changes per 10-minute window to prevent rapid toggling. Intended for admin-only management of queue indicators so servers can keep channel names informative while preventing excessive churn from frequent updates.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/channel name queuelocked`
#### Description
 Set the channel name when a queue is locked. Can only be updated twice per 10 minutes!.
#### Usage: `/channel name queuelocked [channel_name]`
#### Arguments:
`channel_name`: *(Required)* The channel name.
>Sets the channel's display name used to indicate that the queue is locked, replacing the current title with the provided label. Only administrators can perform this action and it is rate-limited to two updates per 10 minutes to prevent rapid name changes; updates take effect immediately and persist until changed again. Common uses include marking a queue as closed during breaks, signaling maintenance or pause states, and providing a clear status indicator for members.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/channel name queuenotempty`
#### Description
 Set the channel name when a queue isn't empty. Can only be updated twice per 10 minutes!.
#### Usage: `/channel name queuenotempty [channel_name]`
#### Arguments:
`channel_name`: *(Required)* The channel name.
>Sets the Discord channel’s visible name to a specified label whenever a queue contains entries, updating the channel immediately so users can see that the queue is active. Enforces a strict limit of two renames per 10 minutes and requires administrator privileges, making it ideal for signaling active queues during events, streams, or staffed support periods while preventing excessive channel churn.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/channel restrictions`
#### Description
 (Default: enabled) Sets whether created channels have restrictions.
#### Usage: `/channel restrictions [mode]`
#### Arguments:
`mode`: *(Required)* If channels are restricted.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`
>Configures whether newly created channels are subject to access restrictions; when enabled, new channels are created with a restricted permissions template (limiting member access and enforcing role-based controls), and when disabled, channels are created without those constraints. Requires administrator privileges and is intended to enforce default privacy or open-collaboration policies — changes affect only channels created after the option is changed and do not modify existing channels.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Clear Queue
### `/clearqueue`
#### Description
 Clears the running queue.
#### Usage: `/clearqueue`

>Clears all entries from the active queue and resets its state, immediately removing every pending position and returning the queue to an empty state. Intended for administrator use when resetting between sessions, removing stale or stuck entries, or forcibly ending a queue; the operation is immediate and irreversible for current queue contents, so notify affected users beforehand and ensure you have the required permissions.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Command Button
### `/commandbutton create`
#### Description
 (BETA) Sends a button which triggers a command when clicked.
#### Usage: `/commandbutton create [command] (color) (emoji) (label)`
#### Arguments:
`command`: *(Required)* Command to invoke.\
`color`: *(Optional)* Color for the button.\
&emsp;&emsp;&emsp; Options: `blurple, gray, green, red`\
`emoji`: *(Optional)* Emoji to include in the button.\
`label`: *(Optional)* Label for the button, defaults to the command name.
>Creates a persistent interactive button in a channel that, when clicked, triggers the bot to execute the specified command as a command interaction so users can invoke bot functionality without typing. Intended for administrators to expose common actions (for example queue sign-ups, role assignments, or event join buttons) and supports customizable appearance; only users with admin privileges can deploy these buttons.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/commandbutton stats`
#### Description
 Send a button that allows players to show their stats.
#### Usage: `/commandbutton stats`

>Posts an interactive button in the channel that, when clicked by a player, displays their individual stats in an ephemeral panel visible only to the clicking user; only administrators can deploy the button. Ideal for quick checks of player progress before matches, during events, or for moderation checks — the button respects Discord interaction permissions and is intended for admin-controlled use.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Config Loading/Saving
### `/config list`
#### Description
 List the 15 most recently created configs.
#### Usage: `/config list`

>Displays the 15 most recently created configs, ordered by creation time and showing key metadata such as config name, creator, and creation timestamp for quick review. Intended for administrators to audit recent changes, verify newly added configurations, or quickly locate recent entries; note that output is limited to the most recent 15 items and requires admin permissions.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/config load`
#### Description
 Loads the queue configuration based on the given name.
#### Usage: `/config load [config]`
#### Arguments:
`config`: *(Required)* Config name.
>Loads a saved queue configuration by name and applies its settings to the active queue, replacing current queue parameters and behavior. Restricted to administrators, it enables quick switching between preset queue setups for events, testing, or recovery; loading a configuration will override existing settings and can affect active sessions, so confirm the target configuration before applying.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/config save`
#### Description
 Save the current queue configuration to a name.
#### Usage: `/config save (name)`
#### Arguments:
`name`: *(Optional)* Name of new config code, or omit for a random code.
>Saves the current queue configuration under a named preset for later reuse or restoration. Useful for preserving setups before tournaments, events, or large changes; note that this operation requires admin privileges and will overwrite an existing preset if the same name is used.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Cross Chat
### `/crosschat join`
#### Description
 Join/create a crosschat room, to share a text channel between servers.
#### Usage: `/crosschat join (room_name) (censored)`
#### Arguments:
`room_name`: *(Optional)* Name of the room.\
`censored`: *(Optional)* If crosschat text should be censored.
>Creates or joins a cross-server shared text room that links the current channel with channels on other servers under a common room name, enabling messages to be broadcast between all linked channels. Intended for administrators to set up shared announcement or community discussion spaces; an optional censorship mode will automatically redact or suppress configured sensitive content across the linked channels to keep shared conversations safe.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/crosschat leave`
#### Description
 Leave the crosschat.
#### Usage: `/crosschat leave`

>Removes the current channel from the crosschat network and stops relaying messages to other crosschat channels. Intended for server administrators to disengage a channel from cross-server conversations — useful when retiring a discussion, isolating spam or abuse, or troubleshooting crosschat behavior; note the change is immediate and the channel will not participate in crosschat until re-added.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Dodge
### `/dodge autoban`
#### Description
 Auto ban players who cause a match to cancel by not joining the voice channel.
#### Usage: `/dodge autoban (duration)`
#### Arguments:
`duration`: *(Optional)* Duration of time in seconds for the ban to last, or 0 to reset.
>Bans players who cause a match to cancel by failing to join the designated voice channel, detecting no-shows at match start and applying a timed ban to deter repeat offenders. Intended as an administrator enforcement tool to maintain queue integrity; it targets only the offending user, respects existing permission and ban states, and avoids impacting other participants.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/dodge mmrpenalty`
#### Description
 Deduct MMR from players who dodge the match.
#### Usage: `/dodge mmrpenalty [amount]`
#### Arguments:
`amount`: *(Required)* Amount of MMR to deduct.
>Applies a specified MMR deduction to players who dodge queued matches, immediately lowering their visible rating and flagging the incident for moderator review. Intended for administrators to deter repeated or intentional match-dodging and maintain queue integrity; apply consistently and conservatively to avoid penalizing accidental disconnects.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/dodge pointspenalty`
#### Description
 Deduct points from players who dodge the match.
#### Usage: `/dodge pointspenalty [amount]`
#### Arguments:
`amount`: *(Required)* Amount of points to deduct.
>Applies a configurable point deduction to players who dodge a scheduled match, reducing their point totals and creating an audit entry for staff review. Restricted to administrators to prevent misuse, it’s commonly used to enforce queue integrity and discourage match dodging—confirm the dodge before applying penalties.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## End Queue
### `/endqueue`
#### Description
 Ends the running queue.
#### Usage: `/endqueue`

>Terminates the active queue session, closes the associated queue thread or channel, prevents further joins, and posts a final announcement to participants summarizing the closure. Intended for administrators to conclude events, clear stalled queues, or transition to a new session; note that this irreversibly stops the current queue and removes participants from the active list, so verify before executing.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Force Start
### `/forcestartconfig conditions`
#### Description
 Sets the requirements for forcestarting.
#### Usage: `/forcestartconfig conditions [min_size] (max_size) (only_fair) (auto_start)`
#### Arguments:
`min_size`: *(Required)* Enter the minimum number of players required. Set to -1 to disable.\
`max_size`: *(Optional)* Enter the maximum number of players required. Set to -1 to ignore.\
`only_fair`: *(Optional)* Should the forcestart happen if teams are not the same size?.\
`auto_start`: *(Optional)* Should the forcestart vote automatically happen when possible?.
>Configures the server’s forcestart behavior by enforcing player-count thresholds, optional team-fairness requirements, and an optional cap, and can automatically initiate the forcestart vote when the configured conditions are satisfied. Intended for administrators to keep lobbies progressing during low activity or to enforce match-size policies for events; note that fairness checks will block forcestart if teams are unbalanced and auto-start only triggers when the current queue state meets the configured rules.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/forcestartconfig cooldown`
#### Description
 (Default: 300) Sets the forcestart cooldown.
#### Usage: `/forcestartconfig cooldown [seconds]`
#### Arguments:
`seconds`: *(Required)* Cooldown duration in seconds.
>Configures the minimum interval enforced between forcestart attempts by updating the forcestart logic so subsequent forcestart requests are blocked until the cooldown elapses. Intended for admins to adjust how frequently forcestart can be triggered to balance quick rotations against preventing abuse; changes take effect immediately and apply server-wide.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Game Integrations
### `/requireregister`
#### Description
 Specify whether players must register their account before playing.
#### Usage: `/requireregister [mode]`
#### Arguments:
`mode`: *(Required)* Game to register with, or None to disable.\
&emsp;&emsp;&emsp; Options: `None, Valorant, Rainbow 6, Overwatch, RocketLeague, Custom API, Manually`
>With register mode being Custom API, please check out `https://docs.neatqueue.com/#/?id=webhooks`         With register mode Manually, players must have their MMR manually set, either through an admin command
> or via an API request `https://docs.neatqueue.com/#/?id=endpoints`.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Gamemodes
### `/gamemode reshuffle`
#### Description
 Sets whether players can reshuffle gamemodes in random gamemode selection.
#### Usage: `/gamemode reshuffle [toggle] (reshuffle_limit)`
#### Arguments:
`toggle`: *(Required)* Whether reshuffling is enabled or disabled.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`\
`reshuffle_limit`: *(Optional)* How many times players can reshuffle gamemodes.
>Enables administrators to control whether players may reshuffle gamemodes during random gamemode selection, toggling the reshuffle capability and optionally enforcing a per-session reshuffle limit. This prevents excessive re-rolls in competitive or tournament lobbies by having the system accept or reject reshuffle requests based on the configured enabled state and remaining reshuffle allowance.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/gamemode selection`
#### Description
 Choose how gamemodes are selected.
#### Usage: `/gamemode selection [gamemode_choice]`
#### Arguments:
`gamemode_choice`: *(Required)* Voting, always random, ordered, or least common.\
&emsp;&emsp;&emsp; Options: `Vote, Random, Least Frequent, Ordered`
>Configures which method the bot uses to choose gamemodes by switching between selection modes (such as random, rotation, or player voting) and applies the change immediately to subsequent queues. Commonly used to enforce fair rotations, enable quick random matches during low activity, or require player votes for competitive sessions; note that only administrators can change this setting and it does not retroactively affect already-started or pending matches.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Heroes
### `/hero add`
#### Description
 Adds the given hero.
#### Usage: `/hero add [hero_name]`
#### Arguments:
`hero_name`: *(Required)* New hero name.
>Registers the specified hero into the bot's roster, making that hero available for selection, queueing, and other hero-related operations. Restricted to administrators to prevent unauthorized changes; the command validates and normalizes the provided name, and rejects duplicates or invalid entries with a clear error message.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/hero bans`
#### Description
 Specify the number of hero bans or 0 to disable.
#### Usage: `/hero bans [bans] (per_team)`
#### Arguments:
`bans`: *(Required)* Number of bans (per team if applicable).\
`per_team`: *(Optional)* If the hero bans are team by team.
>Configures the hero ban behavior for match queues, enforcing either a shared pool of bans or team-specific allocations depending on configuration. This admin-only control takes effect immediately for upcoming matches and remains active until changed, allowing administrators to enforce tournament rules, adjust competitive balance, or temporarily disable bans.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/hero remove`
#### Description
 Removes the given hero.
#### Usage: `/hero remove [hero_name]`
#### Arguments:
`hero_name`: *(Required)* The hero to remove, or ALL to remove all.
>Removes a specified hero from the bot's active hero list, stopping any future matching, notifications, or queue assignments that reference that hero. Intended for administrators to prune outdated, duplicate, or test entries; use with caution since removal is immediate and will affect any active queues or automations relying on that hero.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/hero voting`
#### Description
 Specify who can vote for hero bans. Defaults to All if no captains.
#### Usage: `/hero voting [per_team] [mode]`
#### Arguments:
`per_team`: *(Required)* If the map vote goes team by team. Team 1 picks first ban, Team 2 picks next, ...\
`mode`: *(Required)* Who can vote.\
&emsp;&emsp;&emsp; Options: `All, Captains`
>Controls who may vote on hero bans and whether bans are picked team-by-team. When team-by-team voting is enabled bans are selected in alternating team order (Team 1 picks first, Team 2 next), and the voting mode can be restricted to captains or opened to all players—if no captains are present voting defaults to all. This admin-only setting enforces draft flow and voting permissions during match setup.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Info
### `/info`
#### Description
 View information about the queue configuration.
#### Usage: `/info`

#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Language
### `/language set`
#### Description
 Set the language for the server.
#### Usage: `/language set [language]`
#### Arguments:
`language`: *(Required)* Server language.\
&emsp;&emsp;&emsp; Options: `English, Spanish, French, Portuguese, Japanese, Russian, German, Italian, Ukrainian, Polish, Hebrew, Arabic, Bengali, Hindi, Turkish, Vietnamese, Chinese Traditional, Uwu, Owo`
>If there is an issue with a normal language translation, please fix here: https://crowdin.com/project/neatqueue
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Leaderboard Config
>Leaderboard titles are hyperlinks to the website version of the leaderboard.
### `/leaderboardconfig edits`
#### Description
 Specify who can edit a leaderboard.
#### Usage: `/leaderboardconfig edits [edits]`
#### Arguments:
`edits`: *(Required)* Who can edit the leaderboard buttons.\
&emsp;&emsp;&emsp; Options: `Staff, Anyone, Creator`
>Configures who is permitted to modify leaderboard buttons by selecting an access level (Staff, Anyone, or Creator), updating the leaderboard's edit permissions accordingly. Commonly used by server administrators to lock editing to moderators, restrict it to the original creator, or open it for community edits during events; note that only admins can change this setting and changes apply immediately to existing leaderboard buttons.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/leaderboardconfig ignoreroles add`
#### Description
 Will not show players on leaderboard with this role.
#### Usage: `/leaderboardconfig ignoreroles add [role]`
#### Arguments:
`role`: *(Required)* Required role to show on leaderboard.
>Excludes members holding the specified role from appearing on the leaderboard, preventing them from being displayed or considered in ranking outputs. Designed for server administrators to hide bots, staff, or test accounts or to keep private players off public rankings; changes take effect immediately and apply to current and future leaderboard displays.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/leaderboardconfig ignoreroles remove`
#### Description
 Remove an ignored leaderboard role.
#### Usage: `/leaderboardconfig ignoreroles remove [role]`
#### Arguments:
`role`: *(Required)* Role to no longer ignore.
>Removes a role from the leaderboard's ignored list, causing members with that role to be included in leaderboard rankings again. Intended for administrators to restore visibility for roles that were previously excluded or to correct mistaken ignores; changes take effect immediately and will impact subsequent leaderboard updates, so verify the correct role before removal.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/leaderboardconfig monthly`
#### Description
 Toggle monthly leaderboards, either resets monthly or rolls over.
#### Usage: `/leaderboardconfig monthly [toggle] (mode)`
#### Arguments:
`toggle`: *(Required)* If monthly leaderboards are enabled.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`\
`mode`: *(Optional)* If stats reset for the month, or keep rolling.\
&emsp;&emsp;&emsp; Options: `Reset, Rolling`
>Configures monthly leaderboard behavior, enabling or disabling monthly leaderboards and selecting whether tracked statistics reset at the start of each month or continue accumulating across months. Useful for running month-specific competitions or maintaining long-term rankings—note that Reset clears the current month’s tallies at the month boundary while Rolling preserves cumulative totals, and only server administrators may change this setting.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/leaderboardconfig requiredgames`
#### Description
 (Default: 1) The required number of games played to be displayed on the leaderboard.
#### Usage: `/leaderboardconfig requiredgames [games]`
#### Arguments:
`games`: *(Required)* Required number of games.
>Configures the minimum number of games a player must have completed to appear on the leaderboard, filtering out entries below that activity threshold so rankings reflect regular participants. Commonly used to focus leaderboards on active users (for example, raising the threshold to exclude one-off players); changes take effect immediately and require administrative privileges.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/leaderboardconfig sharedstats serverwide`
#### Description
 Toggle having player stats be shared among all queues.
#### Usage: `/leaderboardconfig sharedstats serverwide [toggle] (name)`
#### Arguments:
`toggle`: *(Required)* If player stats are server wide.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`\
`name`: *(Optional)* Shared stats name, or omit to automatically determine.
>Toggles whether player statistics are shared across all queues on the server, allowing all queues to reflect a single unified set of stats and optionally assign a shared stats name to identify that set. Designed for administrators who want consistent leaderboards or season-wide tracking across queues; enabling server-wide stats unifies players' records for cross-queue ranking, while disabling returns queues to independent stat tracking.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/leaderboardconfig sharedstats set`
#### Description
 Sets the name to use for stats storage. Queues with the same name share stats.
#### Usage: `/leaderboardconfig sharedstats set [name]`
#### Arguments:
`name`: *(Required)* Shared stats configuration name.
>Assigns a shared stats identifier to the queue so that any queues using the same identifier will pool their statistics and present a single combined leaderboard. Intended for administrators who want multiple queue instances or channels to contribute to a unified leaderboard; changing this identifier will merge or separate stats for the affected queues and is restricted to administrative users.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/leaderboardconfig type`
#### Description
 Toggle using the image or text leaderboard.
#### Usage: `/leaderboardconfig type [type]`
#### Arguments:
`type`: *(Required)* Leaderboard format.\
&emsp;&emsp;&emsp; Options: `Images, Text`
>Switches the leaderboard display format between image and text modes, altering how entries are rendered and posted so viewers receive either a graphical leaderboard or a plain-text listing. Intended for administrators to standardize presentation across channels or accommodate client limitations (for example, when images are blocked); the change takes effect immediately and applies to all subsequent leaderboard posts.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Link Queue
### `/link`
#### Description
 Links the current channel to another channel's queue.
#### Usage: `/link [channel]`
#### Arguments:
`channel`: *(Required)* Enter the channel to link to.
>Associates the current channel with another channel’s queue so the current channel shares that queue’s membership, positions, and notifications, causing join/leave actions and position queries to reflect the linked queue. Admin-only operation intended for mirroring or delegating queue management across channels; linking makes actions in either channel affect the same queue and can be undone to restore independent queue behavior.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/unlink`
#### Description
 Unlinks the current channel.
#### Usage: `/unlink`

>Severs the association between a Discord user and their linked NeatQueue profile, removing the user's ability to claim or manage queue items under that link and freeing the identity for re-linking. Common uses include removing stale or compromised links, correcting mistaken associations, or revoking access for banned users; the action is immediate, requires administrator privileges, and the affected user must re-link to restore access.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Lobby Channel
### `/lobbychannel automute`
#### Description
 If the lobby channel should mute all players.
#### Usage: `/lobbychannel automute [toggle]`
#### Arguments:
`toggle`: *(Required)* If players are muted in the lobby channel.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`
>Controls automatic muting of all players in the configured lobby or captains voice channel to prevent chatter during queueing or match setup; enabling enforcement will mute occupants and disabling it returns the channel to normal voice behaviour. Intended for administrators managing queues and tournaments — note that it only affects the designated lobby/captains channel and requires admin privileges to toggle.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/lobbychannel pause`
#### Description
 Pause the current lobby channel countdown timer.
#### Usage: `/lobbychannel pause`

>Pauses the active lobby channel's countdown timer, immediately stopping the countdown and preserving the remaining time so the timer can be resumed later. Useful for temporarily halting queue progression during announcements, moderator interventions, or technical issues; note that only users with administrative privileges can invoke this action and it affects the lobby channel's timer globally until resumed.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/lobbychannel pullall`
#### Description
 Specify pulling players from all channels when their match starts.
#### Usage: `/lobbychannel pullall [toggle]`
#### Arguments:
`toggle`: *(Required)* Pull players from all channels.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`
>Enables automatic collection of players from all voice channels into the match lobby when a match begins by scanning connected voice channels and moving eligible members into the designated lobby channel. Useful for auto-gathering scattered participants to streamline match starts and tournament flow; note it requires appropriate permissions and only affects users who are connected to voice channels at the moment the match triggers.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/lobbychannel returnall`
#### Description
 Specify returning players to their original voice channel from before the match.
#### Usage: `/lobbychannel returnall [toggle]`
#### Arguments:
`toggle`: *(Required)* Return players to their original voice channel.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`
>Restores players to the voice channel they occupied before the match by recording their pre-match voice assignments and moving them back automatically when the match concludes. Commonly used by admins to preserve channel organization after competitive sessions; note that users who disconnected, lost channel permissions, or were moved manually will not be returned.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/lobbychannel set`
#### Description
 Specify the voice channel to move players to/from before/after a game.
#### Usage: `/lobbychannel set [channel]`
#### Arguments:
`channel`: *(Required)* Channel to drag/drop players from/to.
>Assigns a designated voice channel that the bot will move players into before matches begin and return them to after games end. Operated by server administrators, the bot monitors match lifecycle events and automatically relocates participants to the configured channel—ensure the bot has Connect and Move Members permissions and that the target channel is accessible to affected users.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/lobbychannel timer`
#### Description
 Specify how long players have to ready up before the match is cancelled.
#### Usage: `/lobbychannel timer [timer]`
#### Arguments:
`timer`: *(Required)* (Default: 300) Timeout length in seconds.
>Configures the lobby ready-up timeout used when a match is formed by starting a countdown that automatically cancels the match if not all players mark ready within the specified interval. Intended for administrators to tune match pacing—use shorter timeouts to speed turnover in active lobbies or longer ones for casual or tournament play—and note changes apply immediately and can shorten or abort an ongoing ready countdown if reduced below the remaining time.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/lobbychannel toggle`
#### Description
 Toggle creating a voice channel when a match is created for lobby setup.
#### Usage: `/lobbychannel toggle [toggle]`
#### Arguments:
`toggle`: *(Required)* If a new voice channel is made for each lobby setup.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`
>Toggles automatic creation of a temporary voice channel whenever a new match is created for lobby setup, providing participants with a dedicated voice space for coordination. When enabled the bot creates, names, and applies basic permissions to a temporary voice channel for each new lobby; when disabled no voice channel is created and the setting only affects matches created after the change, and running this action requires administrative privileges.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/lobbychannel unpause`
#### Description
 Unpause the current lobby channel countdown timer.
#### Usage: `/lobbychannel unpause`

>Resumes the paused countdown timer for the active lobby channel, restoring the timer to its previous remaining duration and re-enabling scheduled queue transitions. Intended for administrators to continue queue progression after interruptions (such as breaks or accidental pauses); note that it only affects the currently active lobby channel and requires administrative privileges to execute.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Lobby Details
### `/lobbydetails location`
#### Description
 Sets the lobby details message.
#### Usage: `/lobbydetails location [location]`
#### Arguments:
`location`: *(Required)* Where to show lobby details.\
&emsp;&emsp;&emsp; Options: `Direct Message, Teams Message, Both`
>Configures where lobby details are delivered, directing the bot to send the lobby message as a direct message, as a team/channel message, or to both destinations. Intended for administrators to control visibility of queue status—changes take effect immediately and ensure players receive lobby updates in the chosen delivery method.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/lobbydetails remove`
#### Description
 Removed the lobby details message.
#### Usage: `/lobbydetails remove`

>Revokes a staff role's permission to use a specific bot command, removing that role from the command's allowed-role list so members with the role can no longer invoke it. Common uses include stripping temporary moderators of command privileges, tightening access after role changes, or cleaning up outdated role bindings; this admin-only operation is immediate and should be used cautiously as it affects all users with the role.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/lobbydetails set`
#### Description
 Sets the lobby details message.
#### Usage: `/lobbydetails set [message]`
#### Arguments:
`message`: *(Required)* Enter the message to send.
>Currently supports five substitutions:
> 
> `HOST`: Randomly select a player name \
> `QUEUENUM`: Substitute the queue number \
> `RANDOMTEAM`: Substitute a random team name \
> `RANDOM[Option1,Option2,...]`: Randomly select one of the given options and substitute. Ex: `RANDOM[Heads,Tails]` \
> `PASSWORD#T`: Generate a random string of characters, where # is the length of the password, and T is the type of
> characters to be in the password. There are currently 5 supported password types:
> 
> 1. L: Lowercase Letters only
> 2. U: Uppercase Letters only
> 3. N: Numbers only
> 4. C: Lowercase and Uppercase Letters
> 5. A: Lowercase Letters, Uppercase Letters, and Numbers
> 
> Example:
> `/lobbydetails set "Host: HOST, Lobby Name: QUEUENUM, Lobby Password: PASSWORD8A`
> could substitute to
> 
> "Host: @NeatZ, Lobby Name: 12345, Lobby Password: D83mA76x"
> 
> You can further enhance the visuals using Markdown formatting.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Lock
### `/lock`
#### Description
 Lock the queue channel to prevent players from joining.
#### Usage: `/lock (all)`
#### Arguments:
`all`: *(Optional)* Lock all queues?.
>Locks the queue channel, preventing any new players from joining until the lock is removed. When invoked by an administrator, it flips the channel’s join permissions and posts a notice to inform members that the queue is closed, useful for pausing registrations during maintenance, match setup, or to enforce capacity or safety controls.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/unlock`
#### Description
 Unlock the queue channel to allow players to join.
#### Usage: `/unlock (all)`
#### Arguments:
`all`: *(Optional)* Unlock all queues?.
>Reopens a locked queue channel so players can join by restoring the channel’s join permissions and re-enabling admission controls. Intended for administrators after maintenance, matches, or event setup to allow new participants; it can apply to a single queue or all queues at once and will update the channel state to open so join requests are accepted.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Logs
### `/logs`
#### Description
 View a log of used NeatQueue commands.
#### Usage: `/logs (filter)`
#### Arguments:
`filter`: *(Optional)* Filter for logs containing this word.
>Displays a chronological audit of NeatQueue commands executed on the server, showing issuing user, timestamp, and channel while allowing optional filtering to narrow results. Designed for administrators to audit activity, investigate misuse, and verify recent changes; results respect server permissions and retention limits.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## MMR Change
### `/mmr change allow_disable`
#### Description
 Sets if the vote to disable MMR appears.
#### Usage: `/mmr change allow_disable [allow_disable]`
#### Arguments:
`allow_disable`: *(Required)* If MMR changes should be toggleable.
>Controls whether the in-channel vote option to disable MMR is available to users; enabling shows a vote prompt that allows eligible members to initiate a vote to disable MMR for a match, while disabling hides that option and prevents such votes from being started. Restricted to administrators, this setting lets server operators quickly permit or prevent community MMR-disable votes—useful for tournament play, preserving rank integrity, or enforcing temporary policy—and takes effect immediately across the server.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/mmr change hidden`
#### Description
 Sets if MMR changes are hidden from players.
#### Usage: `/mmr change hidden [hidden]`
#### Arguments:
`hidden`: *(Required)* If MMR changes are hidden.
>Controls whether MMR change notifications are visible to players by switching the visibility of individual rating updates; when hidden, only administrators and staff receive MMR change messages. Commonly used during tournaments, recalibration windows, or competitive events to prevent confusion or strategic disclosure, and note that this setting applies server-wide to all players.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/mmr change mode`
#### Description
 (Default: Per Player) Sets if MMR changes are calculated per player, or per team.
#### Usage: `/mmr change mode [mode]`
#### Arguments:
`mode`: *(Required)* How MMR changes are calculated.\
&emsp;&emsp;&emsp; Options: `Per Player, Per Team`
>MMR multipliers will still be applied on a per-player basis. Disable multipliers to make everyone on the team
> get the same MMR change.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/mmr change set`
#### Description
 (Default: 50) Sets the MMR change per game.
#### Usage: `/mmr change set [amount] (loser_mmr) (tie_mmr) (static)`
#### Arguments:
`amount`: *(Required)* The average MMR change for wins and losses.\
`loser_mmr`: *(Optional)* Override the MMR change for losses.\
`tie_mmr`: *(Optional)* Override the MMR change for ties.\
`static`: *(Optional)* If the MMR change should ALWAYS be this value.
>Configures per-match MMR adjustments by establishing a base change and optional overrides for losses and ties. It computes the rating delta from the provided base, applies any loser/tie overrides or a forced static value when set, and takes effect immediately as an admin-only setting to tune ladder responsiveness, tie handling, or enforce a consistent MMR change.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/mmr change variance`
#### Description
 Sets the variance value. Lower value = higher ranges of MMR changes.
#### Usage: `/mmr change variance [amount]`
#### Arguments:
`amount`: *(Required)* (Default: 1600) Variance value. See docs for a calculator.
>Calculator: https://www.desmos.com/calculator/3qtwvlrw8q
> Using the calculator, you can see that as the variance value goes up, the actually outputted MMR change has lower variance.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/mmr decay`
#### Description
 Enable/disable MMR decay and configure the values.
#### Usage: `/mmr decay [toggle] (amount) (amount_type) (duration) (minimum)`
#### Arguments:
`toggle`: *(Required)* Enable/disable MMR decay.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`\
`amount`: *(Optional)* (Default: 20) Amount of MMR to decay.\
`amount_type`: *(Optional)* (Default: Static Value) If the amount is an static value, or a percentage of total MMR.\
&emsp;&emsp;&emsp; Options: `Static Value, Percentage`\
`duration`: *(Optional)* (Default: 1 week) After how long should a player decay in seconds.\
`minimum`: *(Optional)* (Default: None) Lowest MMR a player will decay to, omit to remove.
>Configures whether and how player MMR decays over time by enabling or disabling automatic reductions, selecting either a fixed value or a percentage, and setting the decay interval and optional minimum floor. Commonly used by admins to discourage prolonged inactivity and preserve competitive balance, the system periodically applies the configured reduction to eligible players after the specified duration while ensuring MMR does not drop below the set minimum.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/mmr maximum`
#### Description
 Sets the highest mmr a player can reach in this queue.
#### Usage: `/mmr maximum (mmr)`
#### Arguments:
`mmr`: *(Optional)* Enter the peak rating, or omit to reset.
>Enforces an upper MMR cap for players in the queue, preventing any player's rating from exceeding the configured maximum and adjusting matchmaking calculations to honor that ceiling. Intended for admins who need to limit rating inflation, balance competitive pools, or create skill-bracketed queues; note that changing the cap takes effect immediately and can alter subsequent match placements.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/mmr minimum`
#### Description
 Sets the lowest mmr a player can reach in this queue.
#### Usage: `/mmr minimum (mmr)`
#### Arguments:
`mmr`: *(Optional)* Enter the lowest rating, or omit to reset.
>Enforces a minimum MMR floor for the queue by clamping any calculated or updated player rating so it cannot fall below the configured value. Intended for administrators to protect newcomers or stabilize matchmaking by preventing extreme rating drops; changes take effect immediately for subsequent MMR updates and apply to all players in that queue.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/mmr multipliers placements`
#### Description
 Toggle the placement matches multiplier.
#### Usage: `/mmr multipliers placements [toggle]`
#### Arguments:
`toggle`: *(Required)* If there exists a multiplier for the first 10 matches.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`
>Toggles the placement-match multiplier that adjusts how much weight placement games contribute to players' MMR, switching the multiplier between enabled and disabled states. Admin-only control intended for applying or removing extra weighting during season starts or testing; changes take effect immediately for subsequent match calculations, so use cautiously to avoid unintended ranking shifts.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/mmr multipliers remove`
#### Description
 Remove the MMR multiplier for the given role.
#### Usage: `/mmr multipliers remove [role]`
#### Arguments:
`role`: *(Required)* Role to remove multiplier for.
>Removes the MMR multiplier applied to members with the specified role, reverting their matchmaking rating adjustments to the default calculation. Use this to retire role-based advantages or correct misconfigured perks; the change is immediate for future match calculations and requires administrator privileges.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/mmr multipliers set`
#### Description
 Sets the MMR multiplier for the given role.
#### Usage: `/mmr multipliers set [discord_role] [multiplier] (apply_to_wins) (apply_to_losses) (apply_to_ties) (queue_role)`
#### Arguments:
`discord_role`: *(Required)* \
`multiplier`: *(Required)* Multiplier value. (Ex: 1.2 for a 20% boost).\
`apply_to_wins`: *(Optional)* Apply this multiplier to wins (Default: True).\
`apply_to_losses`: *(Optional)* Apply this multiplier to losses (Default: False).\
`apply_to_ties`: *(Optional)* Apply this multiplier to ties (Default: False).\
`queue_role`: *(Optional)* 
>Configures a role-specific MMR multiplier that adjusts rating changes by applying the specified multiplier to wins, losses, and/or ties and can be limited to a particular queue role. This lets administrators weight rating gains or penalties for different user groups — for example, rewarding veteran roles with larger win gains or softening losses for newcomers — and the change applies only to subsequent match results. Note that this is an admin-only setting and should be used sparingly to avoid distorting competitive balance.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/mmr multipliers streaks`
#### Description
 Toggle the streak multiplier.
#### Usage: `/mmr multipliers streaks [toggle]`
#### Arguments:
`toggle`: *(Required)* If there exists a multiplier for win/loss streaks.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`
>Switches the streak multiplier between enabled and disabled states, affecting how consecutive successful actions modify score and rewards. When enabled, consecutive wins increment a multiplier that amplifies points or rewards for subsequent matches; when disabled, streak bonuses are ignored and changes apply immediately to all future queue outcomes. Intended for admins to enable time-limited streak bonuses during events or to disable them when rebalancing the reward economy, and should be used cautiously since toggling mid-season can alter player progression.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/mmr requirement`
#### Description
 Sets the required mmr to enter this queue.
#### Usage: `/mmr requirement (minimum_mmr) (maximum_mmr)`
#### Arguments:
`minimum_mmr`: *(Optional)* Enter the lowest MMR a player must be to join the queue, or omit to disable.\
`maximum_mmr`: *(Optional)* Enter the highest MMR a player can be to join the queue, or omit to disable.
>Configures the MMR range required for joining the queue, enforcing minimum and maximum thresholds so only players whose MMR falls within the specified bounds can enter. Intended for admins to create skill-balanced or event-specific queues, it validates and rejects invalid ranges, replaces any existing requirement, and warns that very tight or identical min/max values may drastically limit eligible players.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## MVPs 
### `/mvp reward`
#### Description
 (Default: 5) MMR reward for MVPs.
#### Usage: `/mvp reward [amount]`
#### Arguments:
`amount`: *(Required)* Amount of MMR to give as a reward.
>Sets the amount of MMR awarded to players designated as MVPs and applies that value whenever an MVP reward is granted. Typically used by administrators to adjust incentives for regular matches or special events; note that only admins can change this value and updates take effect immediately for subsequent MVP assignments.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/mvp toggle`
#### Description
 Enable/disable MVP votes for matches.
#### Usage: `/mvp toggle [toggle]`
#### Arguments:
`toggle`: *(Required)* Enable/disable MVPs.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`
>Toggles the server-wide MVP voting feature for matches, enabling or disabling users' ability to cast MVP votes. Restricted to administrators, the change takes effect immediately and controls whether upcoming match vote prompts are shown — useful for pausing voting during practice sessions, private events, or when vote collection is undesirable.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/mvp voterequired`
#### Description
 (Default: Disabled) Require players to vote for MVP before voting for winner.
#### Usage: `/mvp voterequired [toggle]`
#### Arguments:
`toggle`: *(Required)* If voting for MVP is required.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`
>Enforces a voting flow that requires each player to cast an MVP vote before being allowed to submit a winner vote, preventing winner selections without prior MVP input. Useful for competitive or community-run matches to ensure standout players are recognized and to reduce vote bias; note that the requirement is disabled by default and must be enabled by an administrator to take effect.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Manage Players
### `/player add`
#### Description
 Adds the given player to the queue.
#### Usage: `/player add [user] (role) (team)`
#### Arguments:
`user`: *(Required)* \
`role`: *(Optional)* Enter the role for the player.\
`team`: *(Optional)* Enter the team for the player if desired.
>Adds the specified player to the active queue and assigns them the chosen role and team, intended for admin use to manage queue membership directly. Performs validation of the provided user and role/team, updates the queue state to reflect the addition, and is commonly used to seed matches, correct queue entries, or pre-assign team composition; only users with administrative privileges can execute this action.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/player ban`
#### Description
 Bans a player from queuing for the given duration of time.
#### Usage: `/player ban [player] (days) (hours) (minutes) (seconds) (reason)`
#### Arguments:
`player`: *(Required)* The player to ban.\
`days`: *(Optional)* Days to ban for.\
`hours`: *(Optional)* Hours to ban for.\
`minutes`: *(Optional)* Minutes to ban for.\
`seconds`: *(Optional)* Seconds to ban for.\
`reason`: *(Optional)* 
>Applies a timed queue ban to a player, preventing them from joining or creating queues for the specified duration and allowing an optional reason for moderation context. Intended for administrators to remove disruptive or rule-breaking users from matchmaking; the restriction takes effect immediately, automatically expires when the duration elapses, and records the action for moderation auditability.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/player banlist clear`
#### Description
 Clears the ban list.
#### Usage: `/player banlist clear`

>Clears all entries from the ban list, removing every banned player so they are immediately allowed to rejoin queues and participate again. Intended for administrators to reset disciplinary state after resolving incidents or starting a new season; use with caution because the action immediately lifts all bans and cannot be undone by the bot.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/player banlist show`
#### Description
 View the player ban list.
#### Usage: `/player banlist show`

>Displays the server's current player ban list to administrators, listing each banned account along with key details such as ban reason, issuing moderator, and timestamp. Intended for auditing and verification of enforcement actions, it helps admins review active bans, identify candidates for unban, and confirm consistency of moderation records; access is restricted to users with administrative privileges.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/player remove`
#### Description
 Removes the given player from the queue.
#### Usage: `/player remove [user]`
#### Arguments:
`user`: *(Required)* The player.
>Removes a specified player from the active queue and automatically reorders remaining entries to close the gap. Restricted to administrators for correcting mistakes, removing inactive or duplicate players, or enforcing queue rules; the removal takes effect immediately and should be used cautiously since it cannot be automatically undone.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/player role ban`
#### Description
 Ban a user from selecting a specific role.
#### Usage: `/player role ban [user] [role]`
#### Arguments:
`user`: *(Required)* The user to ban from the role.\
`role`: *(Required)* The role to ban the user from.
>Prevents a specified user from selecting a particular role by marking that role as prohibited for them and immediately enforcing the restriction across role-selection interfaces and self-assign tools. Intended for administrators to block access to role-restricted channels or elevated permissions—useful for moderating misuse, enforcing event eligibility, or temporarily suspending role-based privileges—and the ban remains in effect until an administrator removes it, overriding further self-assignment attempts.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/player role set`
#### Description
 Set a specific user's preferred role.
#### Usage: `/player role set [user] [role]`
#### Arguments:
`user`: *(Required)* The user to modify.\
`role`: *(Required)* The role to set as preferred.
>Sets a specific user's preferred role so the bot will prioritize that role when assigning users to queues and when issuing role-based notifications. Restricted to server administrators, it establishes the user's preference for matchmaking and notification logic without modifying their actual Discord role.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/player role unban`
#### Description
 Unban a user from a specific role.
#### Usage: `/player role unban [user] [role]`
#### Arguments:
`user`: *(Required)* The user to unban from the role.\
`role`: *(Required)* The role to unban the user from.
>Removes a role-level ban on a specified user, clearing the ban state that prevents that user from being assigned the role and restoring their eligibility for role assignment. Intended for administrators to reverse mistaken or expired role bans; it does not automatically reassign the role or modify other permissions and requires appropriate admin privileges to execute.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/player sub`
#### Description
 Substitute the first player for the second player.
#### Usage: `/player sub [player1] [player2] (gamenum)`
#### Arguments:
`player1`: *(Required)* Enter the player to replace.\
`player2`: *(Required)* Enter the player that will be inserted.\
`gamenum`: *(Optional)* Game to modify. Can be omitted to use this channels game.
>Replaces a specified player in a game's participant list with another player, applying the change to either the current channel's active game or a specified game number. Intended for admins to correct rosters or handle substitutions and no-shows; the command validates that the target player exists in the chosen game and reports an error if no match is found.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/player unban`
#### Description
 Unban the given player from queuing.
#### Usage: `/player unban [player]`
#### Arguments:
`player`: *(Required)* The player to unban.
>Removes a player's ban from queuing by clearing their ban status within the bot’s queue management, immediately restoring their eligibility to join matches. Intended for administrators to reverse accidental or time-limited bans or to reinstate trusted players; note this only affects queue participation and does not change other server permissions or external bans.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Manage Stats
### `/managestats copy`
#### Description
 Copies the player stats from the old queue name to the new one.
#### Usage: `/managestats copy [old_name] [new_name]`
#### Arguments:
`old_name`: *(Required)* Old queue name with stats.\
`new_name`: *(Required)* New name to copy the stats to. Will overwrite any stats stored there.
>Copies the player statistics associated with one queue name to another, duplicating the exact stats set under the new name. Commonly used to preserve stats before renaming queues or to consolidate records under a standard name; this operation will overwrite any existing stats at the destination and is restricted to administrators to prevent accidental data loss.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/managestats merge`
#### Description
 Merges stats from the first queue name into the second queue name.
#### Usage: `/managestats merge [from_queue_name] [to_queue_name] (mmr_merge_strategy)`
#### Arguments:
`from_queue_name`: *(Required)* Queue to merge stats from.\
`to_queue_name`: *(Required)* Queue to merge stats into.\
`mmr_merge_strategy`: *(Optional)* How individual MMRs should be merged together.\
&emsp;&emsp;&emsp; Options: `Maximum, Add Together, Average, Ignore`
>Merges all player statistics from one queue into another, consolidating player entries and combining their MMR values according to a chosen merge strategy. Commonly used to consolidate duplicate or deprecated queues, import historical results into a primary queue, or reconcile parallel queues after format changes; MMRs can be resolved by taking the maximum, summing together, averaging, or leaving existing MMRs unchanged. Requires administrative privileges and will overwrite conflicting target-queue stats, so verify selections before proceeding.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/managestats move`
#### Description
 Moves the player stats from the old queue name to the new one.
#### Usage: `/managestats move [old_name] [new_name]`
#### Arguments:
`old_name`: *(Required)* Old queue name with stats.\
`new_name`: *(Required)* New name to move the stats to. Will overwrite any stats stored there.
>Moves all player statistics associated with one queue name to another, transferring every player record to the target identifier and replacing any statistics already stored there. Intended for admins to rename queues, correct misnamed entries, or consolidate duplicates; note that the destination’s previous stats will be overwritten and the transfer is immediate and cannot be undone.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/managestats reset all`
#### Description
 Resets all stats for all queues, or for the inputted queue name.
#### Usage: `/managestats reset all (queue_name)`
#### Arguments:
`queue_name`: *(Optional)* The queue name to reset stats for.
>Clears all collected statistics for every queue or for a specified queue, returning counters and aggregated metrics to their initial zeroed state. Intended for administrators to purge outdated or incorrect metrics before a new reporting period or after corrective maintenance; this irreversible operation permanently removes aggregated stats, so use with caution.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/managestats reset mmr`
#### Description
 Resets all MMR for all queues, or for the inputted queue name.
#### Usage: `/managestats reset mmr (queue_name)`
#### Arguments:
`queue_name`: *(Optional)* The queue name to reset stats for.
>Resets all player MMR values to their baseline for every queue or for a single specified queue, clearing current ratings so matchmaking treats affected players as unrated. Intended for seasonal resets, large-scale rating corrections, or rebalancing after rule changes; this admin-only operation takes immediate effect for all affected players and cannot be undone by the bot, so execute it only when a full reset is required.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/managestats reset player`
#### Description
 Reset the user's data for all queues or a certain queue.
#### Usage: `/managestats reset player [user] (queue_name)`
#### Arguments:
`user`: *(Required)* Enter the desired user.\
`queue_name`: *(Optional)* Enter the queue data to remove from. Ignore to delete all data from all queues.
>Resets a user's queue-related data either across all queues or confined to a specified queue, removing positions, match counts, and other per-queue metrics. Intended for administrators to correct errors, remove stalled or duplicate entries, or prepare accounts for re-enrollment; this action is irreversible for the selected scope and should be used with caution.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Maps
### `/map add`
#### Description
 Adds the given map.
#### Usage: `/map add [map_name] (game_modes) (image_url)`
#### Arguments:
`map_name`: *(Required)* New map name.\
`game_modes`: *(Optional)* Comma separated list of game modes for map, if applicable.\
`image_url`: *(Optional)* Image to show when map selected.
>Adds a new map entry to the bot’s map roster—ideal for populating tournament rotations, seasonal pools, or mode-specific lists—associating optional game mode tags and an image reference so the map can be selected and displayed in queue selections. Restricted to administrators, it validates inputs and updates the visible map list immediately, so accurate map names and valid image URLs ensure correct display.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/map bans`
#### Description
 Specify the number of map bans per team, or 0 to disable.
#### Usage: `/map bans [bans] (per_team)`
#### Arguments:
`bans`: *(Required)* Number of bans per team.\
`per_team`: *(Optional)* If the map bans are team by team.
>Configures the number of map bans applied during match setup, allowing administrators to set zero to disable bans entirely. When enabled, bans are allocated and enforced during the pick/ban phase with an option to apply bans separately for each team, and changes require administrative privileges.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/map remove`
#### Description
 Removes the given map.
#### Usage: `/map remove [map_name]`
#### Arguments:
`map_name`: *(Required)* The map to remove, or ALL to remove all.
>Removes a specified map from the server’s configured map list, allowing administrators to delete individual entries or clear the entire collection. Intended for keeping the map pool current—commonly used to retire duplicates, remove deprecated or problematic maps, or prepare for a reload—and note that the deletion is immediate and will affect any active queues that reference the removed map.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/map reshuffle`
#### Description
 Sets whether players can reshuffle maps in random map selection.
#### Usage: `/map reshuffle [toggle] (reshuffle_limit)`
#### Arguments:
`toggle`: *(Required)* Whether reshuffling is enabled or disabled.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`\
`reshuffle_limit`: *(Optional)* How many times players can reshuffle maps.
>Controls whether players can request a reshuffle of the randomly selected map and optionally enforces a per-player reshuffle limit. When enabled, players may trigger reshuffles up to the configured limit per session/match; when disabled, all reshuffle attempts are rejected and the current selection remains. This setting is restricted to administrators and takes effect immediately for subsequent map selections.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/map selection`
#### Description
 Choose how maps are selected.
#### Usage: `/map selection [map_choice]`
#### Arguments:
`map_choice`: *(Required)* Voting, always random, or least common.\
&emsp;&emsp;&emsp; Options: `Vote, Random, Least Frequent`
>Configures the queue's map selection behavior by switching between available modes (such as random, rotation, or captain's pick) and applies the chosen mode to all upcoming map picks. Available only to administrators, this immediately changes how maps are chosen for queues and matches—useful for enforcing tournament rules, ensuring variety, or reverting to defaults—and should be set before starting competitive sessions since it affects active queues.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/map voting`
#### Description
 Specify who can vote for map picks and map bans. Defaults to All if no captains.
#### Usage: `/map voting [per_team] [mode]`
#### Arguments:
`per_team`: *(Required)* If the map vote goes team by team. Team 1 picks first map, Team 2 picks next, ...\
`mode`: *(Required)* Who can vote.\
&emsp;&emsp;&emsp; Options: `All, Captains`
>Configures voting behavior for map picks and bans by determining whether selections proceed team-by-team and who is eligible to cast votes. When team-by-team ordering is enabled selections alternate by team, and voting can be restricted to captains or opened to all—defaulting to all if no captains exist—allowing admins to standardize selection flow and prevent unauthorized or out-of-order votes.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Match Start
### `/matchstart dmplayers`
#### Description
 (Default: Enabled) Send a notification DM to all players when a match starts.
#### Usage: `/matchstart dmplayers [toggle]`
#### Arguments:
`toggle`: *(Required)* If players are DMed on start.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`
>Sends a direct message to each player's Discord account when a match starts, with the bot composing and dispatching match-start notifications to all players in that match. Intended for administrators to control automated match-start alerts for coordinating fast-moving queues or remote participants; recipients must allow DMs from the server or bot to receive the messages.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/matchstart removefromqueues`
#### Description
 (Default: Enabled) Remove players from other queues when a match starts.
#### Usage: `/matchstart removefromqueues [toggle]`
#### Arguments:
`toggle`: *(Required)* If players are removed from queues on start.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`
>Automatically removes players from any other active queues when a match begins, ensuring each participant is assigned to a single concurrent match and preventing duplicate assignments and scheduling conflicts. Useful for tournaments and structured lobbies to keep queue state consistent; disabling it permits players to remain in multiple queues and may result in overlapping match assignments, so enable it when exclusive match participation is required.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/matchstart shuffleonstart`
#### Description
 (Default: Disabled) Shuffle the player pool on start.
#### Usage: `/matchstart shuffleonstart [mode]`
#### Arguments:
`mode`: *(Required)* \
&emsp;&emsp;&emsp; Options: `Disabled, Lottery, Priority`
>Randomizes the player pool each time a match starts, replacing deterministic queue order with a shuffled order so teams and pairings are assigned unpredictably. Intended for admins to reduce predictable matchups and bias in repeated sessions; note this option is disabled by default and only affects ordering at match start.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/matchstart when`
#### Description
 (Default: Either) Start the match when the queue fills, or only when forcestarted.
#### Usage: `/matchstart when [mode]`
#### Arguments:
`mode`: *(Required)* Condition for starting the match.\
&emsp;&emsp;&emsp; Options: `Queue Filled, Forcestart, Either`
>Configures the trigger that starts matches by selecting whether matches begin automatically when the queue fills, only when forcibly started by staff, or under either condition. Useful for enabling fast casual play with automatic starts or enforcing manual control during organized events; note that only administrators can change this setting and the default allows both automatic and forcestarts.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Matchmaking
>The matchmaker works by checking the current queue if there are
> enough players to create a match. A match will only be created if the total range of player MMRs
> is less than the specified matchmaking range. Every 15 seconds, the range will be increased by the
> matchmaking leniency, and the match conditions will be rechecked with this new extended matchmaking range.
### `/matchmaking leniency`
#### Description
 Every 15 seconds, how much the range will increase for a better chance at a match.
#### Usage: `/matchmaking leniency [value] (maximum)`
#### Arguments:
`value`: *(Required)* How much to increase the range by.\
`maximum`: *(Optional)* 
>Adjusts the matchmaking leniency by changing how much the search range expands at each 15-second interval, optionally bounded by a maximum cap. Controls match-finding aggressiveness—increase the increment to broaden searches and speed matches during low activity or decrease it to favor closer matches; changes take effect immediately and repeat every 15 seconds until the cap is reached (admin-only).
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/matchmaking range`
#### Description
 The range of MMRs for matches. Tighter range = more waiting and players required.
#### Usage: `/matchmaking range [range]`
#### Arguments:
`range`: *(Required)* Range of player MMRs.
>Adjusts the allowed MMR spread used to form matches, controlling how closely players' skill ratings must align; a tighter range enforces stricter parity but increases the number of players required and average queue times, while a wider range reduces wait times at the expense of larger skill disparities. Commonly used by admins to enforce competitive parity for events or to relax constraints during low-population periods; note that excessively narrow ranges can prevent matches from forming until enough similarly rated players are available.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Messages + Styling
### `/message queuemessage delay`
#### Description
 (Default: 3) Sets the delay for when a new queue message comes up.
#### Usage: `/message queuemessage delay [seconds]`
#### Arguments:
`seconds`: *(Required)* New message delay.
>Adjusts the bot's message-posting interval so new queue entries are announced after the configured delay, controlling how frequently the bot surfaces the next queue message. Intended for administrators to tune pacing—e.g., lengthen the delay during low activity or shorten it for fast-moving events—and the change takes effect immediately for subsequent queue announcements.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/message queuemessage deletions`
#### Description
 (Default: Enabled) Sets whether old queue updates should be deleted.
#### Usage: `/message queuemessage deletions [toggle]`
#### Arguments:
`toggle`: *(Required)* Toggle between editing queue updates, or sending new messages.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`
>Toggles automatic removal of previous queue update messages when new updates are posted, keeping channels uncluttered by ensuring only the most recent update remains visible. Commonly enabled to present a single current queue to members or disabled to retain a visible history for auditing; enabling will delete the bot’s older update messages and requires administrator privileges.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/message queuemessage edits`
#### Description
 (Default: Enabled) Set whether queue updates should edit the previous message.
#### Usage: `/message queuemessage edits [toggle]`
#### Arguments:
`toggle`: *(Required)* Toggle between editing queue updates, or sending new messages.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`
>Toggles whether queue updates overwrite the previous bot message or post new messages for each update; when enabled, the bot edits its last queue message in-place, and when disabled it sends a fresh message for every update. Use editing to keep channels tidy and reduce notification clutter for frequent updates, or disable editing to preserve a clear history and allow reactions or pinning of individual updates; note that only administrators can change this setting.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/message queuemessage history`
#### Description
 (Default: Disable) Sets whether to send a new message for every queue interaction.
#### Usage: `/message queuemessage history [toggle]`
#### Arguments:
`toggle`: *(Required)* Toggle between sending queue join/leaves in the channel.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`
>Toggles whether the bot sends a new message for every queue interaction or updates an existing queue message, altering how interactions appear and propagate in the channel. Enable to preserve a chronological message log for auditing or review; disable to consolidate activity into a single, continuously edited post to reduce message clutter and notification volume.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/message queuemessage leaderboardbutton`
#### Description
 Show a 'Leaderboard' button on the queue message.
#### Usage: `/message queuemessage leaderboardbutton [toggle]`
#### Arguments:
`toggle`: *(Required)* If the leaderboard button is shown.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`
>Displays or removes a 'Leaderboard' interactive button on the active queue message so members can open the queue's leaderboard directly from the message. Intended for admins who want quick, on-message access to rankings during events or regular play; enabling the button updates the queue message to include the interactive element, while disabling it removes that element to keep the interface uncluttered.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/message queuemessage sticky`
#### Description
 (Default: Enabled) Sets whether the queue message sticks to the bottom of the channel.
#### Usage: `/message queuemessage sticky [toggle]`
#### Arguments:
`toggle`: *(Required)* Toggle the message being sticky.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`
>Controls whether the queue message remains anchored to the bottom of the channel by automatically repositioning or refreshing that message as new activity occurs. Keeps the queue prominently visible during active sessions and prevents it from being buried by chat, useful for live events, ticketing, or moderated queues. Restricted to administrators and changes the message’s positional behavior for all users; the sticky behavior is enabled by default.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/message winnermessage format`
#### Description
 Sets the format for the winner message.
#### Usage: `/message winnermessage format [mode]`
#### Arguments:
`mode`: *(Required)* Formatting type.\
&emsp;&emsp;&emsp; Options: `Detailed, Simple`
>Configures the winner announcement format and applies the selected layout to all subsequent winner notifications. Restricted to administrators, it switches between predefined presentation modes (such as concise, detailed, or tagged), updates the active template immediately, and does not alter any previously sent announcements.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/message winnermessage pin`
#### Description
 Sets whether the message gets pinned.
#### Usage: `/message winnermessage pin [mode]`
#### Arguments:
`mode`: *(Required)* Pin mode.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`
>Sets whether the bot's winner announcement message is pinned in the channel, toggling the message's pinned state to control visibility of important announcements. Restricted to administrators, the change takes effect immediately so winning notifications can be kept easily accessible or removed from the pinned list when they’re no longer relevant.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/message winnermessage results`
#### Description
 Set who can vote for the result, or if results are fully disabled.
#### Usage: `/message winnermessage results [value]`
#### Arguments:
`value`: *(Required)* Who can vote, or if the match has no outcome.\
&emsp;&emsp;&emsp; Options: `Default, Staff Only, Disabled`
>Configures who can vote on match outcomes or disables result voting entirely by setting the result-access mode to Default, Staff Only, or Disabled. Typically used to allow open community voting, restrict adjudication to staff during sensitive events, or suspend voting during maintenance; this admin-only setting takes effect immediately and applies server-wide to all matches.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/message winnermessage sticky`
#### Description
 Sets whether the message sticks to the bottom of chat.
#### Usage: `/message winnermessage sticky [mode]`
#### Arguments:
`mode`: *(Required)* Sticky mode.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`
>Controls whether the winner announcement remains fixed as the most recent message in chat. When enabled, the bot keeps the winner announcement anchored to the bottom of the channel by automatically updating or reposting it as new messages arrive so it stays prominent; when disabled, the announcement behaves like a normal message and moves up as activity continues. Intended for administrators to highlight winners during active giveaways or events — note that enabling sticky behavior can increase message churn in busy channels.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Miscellaneous/Utility
### `/misc mention teamscreated`
#### Description
 (Default: Disabled) Mention the players after teams are created.
#### Usage: `/misc mention teamscreated [toggle]`
#### Arguments:
`toggle`: *(Required)* If the players are mentioned after teams are created.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`
>Toggles whether players are mentioned in Discord when teams are created. When enabled, the bot will mention each player in the team announcement to notify participants; when disabled, teams are posted without mentions — useful for reducing notification noise or ensuring players receive immediate pings.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/misc nametype`
#### Description
 Sets whether to use nicknames or discord names (Default: nick).
#### Usage: `/misc nametype [type]`
#### Arguments:
`type`: *(Required)* The type of names to be used.\
&emsp;&emsp;&emsp; Options: `Discord, Nicknames`
>Configures whether the bot displays users by server nicknames or by their Discord account names when presenting queue entries. The choice is applied globally to all queues to standardize display formatting, takes effect immediately, and requires administrator privileges to change.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/misc purge`
#### Description
 Delete ALL messages in the channel except the queue message if it exists.
#### Usage: `/misc purge`

>Removes all messages from the current channel while preserving the queue message if present. It identifies the queue message and bulk-deletes remaining messages to quickly clear chat clutter for administrators, with deletions being permanent and subject to Discord's bulk-delete limitations (e.g., very old messages may not be removable in bulk).
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Mod Channel
### `/staffchannel remove`
#### Description
 Remove the set results channel.
#### Usage: `/staffchannel remove`

>Unsets the configured results channel, stopping the bot from posting queue results to that channel. Intended for server administrators when a results channel is being removed or replaced; after execution the bot will no longer publish automated results until a new channel is configured and administrative privileges are required to run it. This action does not delete existing messages in the channel—only clears the posting target for future results.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/staffchannel set`
#### Description
 Sets the results channel to send queue history.
#### Usage: `/staffchannel set [channel] (serverwide)`
#### Arguments:
`channel`: *(Required)* The text channel to send queue history to.\
`serverwide`: *(Optional)* Should the channel be global for all queues or just this one?.
>Sets the channel where the bot will post queue history, updating the server configuration so future queue summaries and history exports are routed to the selected destination. Intended for administrators who need centralized visibility or archival of queue activity; the serverwide option applies the selection across the entire server to ensure consistent delivery to staff or archive channels.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Modify Player Data
### `/add decaygraceperiod`
#### Description
 Add a grace period for a user so they won't be affected by MMR decay.
#### Usage: `/add decaygraceperiod [time] (user) (role)`
#### Arguments:
`time`: *(Required)* Enter the desired grace period time in seconds.\
`user`: *(Optional)* The user to modify.\
`role`: *(Optional)* The role to modify.
>Grants a temporary grace period that exempts a specified user or members of a specified role from MMR decay for the given duration. This preserves players' MMR during events like tournament downtime, appeals, or coaching periods, requires administrative privileges to set or remove, and automatically ends when the specified time elapses.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/add stats`
#### Description
 Increment the stats for a player or role, use a negative number to decrement.
#### Usage: `/add stats [stat] [value] (user) (role)`
#### Arguments:
`stat`: *(Required)* The stat to increment.\
`value`: *(Required)* The value to increment.\
`user`: *(Optional)* The user to modify.\
`role`: *(Optional)* The role to modify.
>Adjusts a player's or role's statistical totals by applying the provided numeric delta (positive to increment, negative to decrement), immediately updating the tracked stat values for the specified target(s). Commonly used to correct score errors, apply manual awards or penalties, or reconcile imported results; access is limited to administrators and should be used sparingly to avoid unintended inconsistencies.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/set ign`
#### Description
 Sets the players IGN (used in `/register` or `/ign`).
#### Usage: `/set ign [account] (user) (role)`
#### Arguments:
`account`: *(Required)* Enter the desired IGN, or 'none' to remove.\
`user`: *(Optional)* The user to modify.\
`role`: *(Optional)* The role to modify.
>Assigns or clears a player's in-game name that the bot uses for registration and identity-related features, and can apply that IGN to a specific user or to all members of a role. Administrators use it to correct or prefill player names, remove outdated entries, or standardize names across a role, with changes taking effect immediately and overriding any previous assignments.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/set stats`
#### Description
 Sets the stats for a player or role.
#### Usage: `/set stats [stat] [value] (user) (role)`
#### Arguments:
`stat`: *(Required)* The stat to set.\
`value`: *(Required)* The value to set.\
`user`: *(Optional)* The user to modify.\
`role`: *(Optional)* The role to modify.
>Updates the specified statistic for a player or role and applies that change to leaderboards, autorole thresholds, and any derived rankings or displays. Intended for admin use to correct errors, grant or remove points, or set role-based stats; changes take effect immediately and may alter leaderboard positions and role assignments.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Number Of Lobbies
### `/numberoflobbies`
#### Description
 (Default: 1) Sets the number of lobbies to create.
#### Usage: `/numberoflobbies [lobbies]`
#### Arguments:
`lobbies`: *(Required)* The number of lobbies.
>Sets the configured count of simultaneous lobbies the bot will create when preparing queue sessions, adjusting how future queue operations allocate players across lobbies. Restricted to administrators, this is useful for scaling sessions to match player availability or server capacity; changes take effect only for subsequent queue starts and default to one lobby if not modified.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Number Of Teams
### `/numberofteams`
#### Description
 (Default: 2) Sets the number of teams.
#### Usage: `/numberofteams [number]`
#### Arguments:
`number`: *(Required)* The number of teams.
>Sets the number of teams the bot will create when forming matches, determining how queued players are partitioned and how the bot balances teams during match setup. Intended for administrators configuring event formats or competitive play, the value takes effect immediately for subsequent queues and should be chosen to match the event structure and expected player counts to avoid uneven teams.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Party Queue
### `/partyqueue maxrange`
#### Description
 Set the max range of MMRs in a party that can enter the queue.
#### Usage: `/partyqueue maxrange (max_range)`
#### Arguments:
`max_range`: *(Optional)* The max range of MMRs, or omit to remove.
>Sets the maximum allowed difference between the highest and lowest MMR in a party and enforces this threshold at queue entry, rejecting any party whose MMR spread exceeds the configured value. Commonly used by admins to preserve match balance and prevent mismatched groupings; changes apply immediately to all future queue entry checks and can only be modified by server administrators.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/partyqueue maxsize`
#### Description
 Set the max party size that can enter the queue.
#### Usage: `/partyqueue maxsize (max_size)`
#### Arguments:
`max_size`: *(Optional)* The max party size, or omit to remove.
>Sets the maximum allowed party size for joining the queue, preventing parties larger than the configured limit from entering. Clearing the limit removes size restrictions so any party can join, and only server administrators can change this setting to keep queue rules controlled. Common use cases include enforcing fair matchmaking, managing lobby or voice-channel capacity, and preventing oversized groups from disrupting rotations.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/partyqueue minsize`
#### Description
 Set the min party size that can enter the queue.
#### Usage: `/partyqueue minsize (min_size)`
#### Arguments:
`min_size`: *(Optional)* The min party size, or omit to remove.
>Enforces a minimum party size required for joining the queue, preventing parties that fall below the configured threshold from entering. Intended for administrator control of queue composition during events or limited-player modes, it validates the configured threshold and applies the restriction to all join attempts until an administrator changes it.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/partyqueue preventoverfill`
#### Description
 (Default: Enabled) Prevent a party from joining queue if it over-fills the queue.
#### Usage: `/partyqueue preventoverfill [toggle]`
#### Arguments:
`toggle`: *(Required)* If parties can overfill a queue.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`
>Enforces a strict capacity check that prevents parties from joining if their addition would exceed the queue’s remaining slots, and when disabled allows parties to join even if that results in overfilling. Designed for administrators to preserve fair queue order and match integrity by rejecting oversized join attempts at the time of entry; toggling the setting immediately changes how join requests are validated.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/partyqueue toggle`
#### Description
 Enable party queue, allowing players to create parties with `/party` before joining.
#### Usage: `/partyqueue toggle [toggle]`
#### Arguments:
`toggle`: *(Required)* Enable or disable party queue.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`
>Toggles the server’s party queue feature, enabling players to form parties before joining when enabled or forcing solo-only joins when disabled. When enabled, the bot accepts and enforces party registrations and join rules across the queue immediately; when disabled, party creation is blocked and all join requests are processed as individual entries. Restricted to server administrators to control group participation during events or peak usage.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Predictions
### `/points change loss`
#### Description
 (Default: 100) Set how many points players gain for a loss (not MMR).
#### Usage: `/points change loss [value]`
#### Arguments:
`value`: *(Required)* Points for a loss.
>Configures how many non‑MMR points are awarded to a player when they lose a match, replacing the default award (100). Intended for server admins to tune progression and match incentives—common uses include reducing loss points to discourage intentional losses or increasing them to soften penalties; changes take effect immediately and apply globally to all players and future matches.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/points change win`
#### Description
 (Default: 100) Set how many points players gain for a win (not MMR).
#### Usage: `/points change win [value]`
#### Arguments:
`value`: *(Required)* Points for a win.
>Sets the number of points awarded to players for a match win (separate from MMR), immediately updating the per-win reward used in score calculations. Commonly used to adjust competitive balance for seasons or events, to incentivize participation, or to scale rewards for different formats; note that the change only affects future wins and does not modify players’ MMR or retroactively alter past results, and requires administrative privileges to apply.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/points maximum`
#### Description
 Sets the highest number of points a player can reach.
#### Usage: `/points maximum (points)`
#### Arguments:
`points`: *(Optional)* Enter the peak points, or omit to reset.
>Sets the maximum point threshold any player may hold and enforces that ceiling across all point awards and adjustments. Restricted to administrators, changing this value is useful for balancing progression, limiting rewards, or establishing season caps; lowering the maximum will immediately cap any existing player totals that exceed the new limit and will prevent further accrual above it.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/points minimum`
#### Description
 Sets the lowest number of points a player can reach.
#### Usage: `/points minimum (points)`
#### Arguments:
`points`: *(Optional)* Enter the lowest points value, or omit to reset.
>Sets the minimum allowed point total for players, clamping score calculations and penalties so no player's points can fall below the configured floor. Restricted to administrators, this setting takes effect immediately and is used to prevent negative or excessively low balances and to stabilize ranking and reward logic across the server.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/points multipliers remove`
#### Description
 Remove the points multiplier for the given role.
#### Usage: `/points multipliers remove [role]`
#### Arguments:
`role`: *(Required)* Role to remove multiplier for.
>Removes the points multiplier associated with a specified role, causing members with that role to earn points at the default rate instead of the previously boosted rate. Useful for ending temporary event boosts, correcting mistaken or excessive multipliers, or standardizing rewards across roles; this action takes effect immediately and should be restricted to administrators to avoid accidental changes.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/points multipliers set`
#### Description
 Sets the points multiplier for the given role.
#### Usage: `/points multipliers set [role] [multiplier]`
#### Arguments:
`role`: *(Required)* \
`multiplier`: *(Required)* Multiplier value. (Ex: 1.2 for a 20% boost).
>Adjusts the points multiplier applied to all users holding a specified role, changing how many points they earn from actions. Intended for administrators to balance rewards across roles—use it to boost or reduce earning rates for moderators, veterans, or special groups, and note that changes take effect immediately for all current role members.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/points startingvalue`
#### Description
 (Default: 0) Set how many points players start with (not MMR).
#### Usage: `/points startingvalue [value]`
#### Arguments:
`value`: *(Required)* Starting points value.
>Sets the default starting points awarded to players when they begin play, distinct from MMR, with a default value of 0. Intended for server administrators to standardize initial scoring for casual queues or tournaments; changing the value affects only future allocations and does not retroactively alter existing player totals.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/predictions channel`
#### Description
 Specify the channel to show predictions.
#### Usage: `/predictions channel [channel]`
#### Arguments:
`channel`: *(Required)* The predictions channel.
>Sets the destination channel for prediction messages, directing all future prediction notifications, embeds, and updates to the specified text channel. Typically used to centralize prediction output in an announcements or events channel or to switch output during testing and live events; this change takes effect immediately and requires administrative permissions to execute.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/predictions role`
#### Description
 Role to ping when a prediction opens.
#### Usage: `/predictions role [role]`
#### Arguments:
`role`: *(Required)* Role to ping.
>Sets the role that will be notified whenever a new prediction opens by automatically adding a mention to the prediction announcement so members with that role receive a notification. Intended for alerting specific groups (e.g., moderators, bettors, event participants); requires administrator privileges and should avoid selecting broad pingable roles (like @everyone) to prevent excessive notifications.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/predictions timer`
#### Description
 Specify the duration the prediction lasts before closing.
#### Usage: `/predictions timer [timer]`
#### Arguments:
`timer`: *(Required)* (Default: 180) Prediction length in seconds.
>Configures how long a prediction remains open before it is automatically closed and resolved. Restricted to administrators, it adjusts the prediction lifecycle so time-bound polls or queue decisions can be shortened or extended for pacing and moderation; choose durations carefully to avoid premature closures or excessively long waits.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/predictions toggle`
#### Description
 Specify the channel to show predictions.
#### Usage: `/predictions toggle [toggle]`
#### Arguments:
`toggle`: *(Required)* If predictions are enabled or disabled.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`
>Enables or disables the predictions feature for the server, causing the bot to begin posting prediction messages to—or stop posting them in—the designated predictions channel. Commonly used to pause predictions during special events or reopen them afterward; only users with administrative privileges can toggle this setting and changes take effect immediately for the configured channel.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Queue Entry Methods
### `/queueentry channel set`
#### Description
 (BETA) Add players to the queue when they join the voice channel.
#### Usage: `/queueentry channel set (channel)`
#### Arguments:
`channel`: *(Optional)* Queue entry voice channel, or omit to remove.
>Adds players to the queue automatically when they join the specified voice channel by monitoring voice-state changes and enqueuing entrants as they connect. Intended for admins to designate a lobby for matchmaking, scrims, or pickup games; note that only joins to the configured channel trigger queueing and changing the lobby requires admin privileges.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/queueentry methods`
#### Description
 (BETA) Specify how players can join the queue.
#### Usage: `/queueentry methods [modes]`
#### Arguments:
`modes`: *(Required)* The methods players can use to join the queue.\
&emsp;&emsp;&emsp; Options: `Buttons, Voice Channel, Either`
>Configures which methods players may use to join the queue—Buttons, Voice Channel, or Either—and applies that restriction to the active queue session. The bot enforces the selected mode by enabling or disabling join controls and validating voice‑channel presence for join attempts, with changes taking effect immediately. Admin-only; use it to force voice‑only entry for matches, disable button joins during tournaments, or allow both methods for casual sessions to match event requirements and prevent unwanted join methods.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/queueentry price`
#### Description
 Set how many points a player must pay to join the queue.
#### Usage: `/queueentry price [value] (payout_fee)`
#### Arguments:
`value`: *(Required)* Price in points.\
`payout_fee`: *(Optional)* Fee to take when paying out rewards. A value of 10 means a 10% fee is applied.
>Configures the point cost required for players to join the queue and optionally sets a percentage fee to be deducted when rewards are paid out. This admin-only control helps manage queue size, deter low-effort or spam entries, and fund prize pools by reducing winners' net payouts according to the configured fee; costs are denominated in points and any fee decreases the amount distributed to recipients.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/queueentry survey add`
#### Description
 Adds a new survey which players must respond to before queuing.
#### Usage: `/queueentry survey add [title] [allow_other] [options] (key) (show_in_teams_message)`
#### Arguments:
`title`: *(Required)* Title of the survey.\
`allow_other`: *(Required)* If players can pick "Other" and manually type their response.\
`options`: *(Required)* Comma separated list of options.\
`key`: *(Optional)* Key which is used to store the results for a player, or omit to use the title.\
`show_in_teams_message`: *(Optional)* 
>Creates a configurable pre-queue survey that players must complete before joining, presenting a set of selectable options with an optional free-text "Other" choice and tying each player's response to an optional result key. Intended for admins to gate queue entry and collect preferences or eligibility (for example, role selection, availability, or equipment checks); enabling show-in-team-messages will include responses in team notifications.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/queueentry survey delete`
#### Description
 Delete a previously added survey.
#### Usage: `/queueentry survey delete [title]`
#### Arguments:
`title`: *(Required)* Title of the survey.
>Deletes a previously added survey by matching the provided title and removing it from the bot’s active survey list, ensuring the survey and its references are no longer available for users. Intended for administrators to clean up outdated or duplicate surveys; the operation will report an error if the title is not found and is irreversible once performed.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Queue Name
### `/queuename`
#### Description
 Sets the name for this queue. All stats are tied to the queue name.
#### Usage: `/queuename [name]`
#### Arguments:
`name`: *(Required)* New queue name.
>Sets the queue's name and associates all queue statistics and reports with that identifier so metrics and history are displayed under the chosen label. Intended for administrators to rename queues for clarity, organization, or rebranding; note that changing the name will change how stats and references appear across the system.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Queue Type
### `/queuetype`
#### Description
 Select the type of queue to run. See docs for detailed explanations.
#### Usage: `/queuetype [type]`
#### Arguments:
`type`: *(Required)* The type of queue.\
&emsp;&emsp;&emsp; Options: `PUGs/Normal Individual Queue, Matchmaking, Full Team vs Full Team, Select Team On Join`
>PUGs/Normal Individual Queue: The default queue setup, players join individually to get put into a match when the queue is filled.
> Matchmaking: Players join the queue, and once there are enough players within their MMR range, a match is created.
> Full Team vs Full Team: Captains join the queue and pull in the entire team. No team setup is required.
> Select Team On Join: The queue has join buttons for each team, no team setup is required.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Ranks/Automatically Assign Discord Roles
### `/autoroles copy`
#### Description
 Copies the auto roles config to the desired channel.
#### Usage: `/autoroles copy [channel]`
#### Arguments:
`channel`: *(Required)* Channel with queue to copy autoroles config to.
>Copies the auto-role configuration from the source queue into a specified target channel, replicating role assignments, opt-in/opt-out settings, and role ordering so the target channel enforces the same automatic role behavior. Intended for administrators who need to replicate queue behavior across channels quickly; note that this operation overwrites the target channel’s existing auto-role settings and requires administrative permissions.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/autoroles ingame`
#### Description
 Assign a role to players who are in a match that is removed after.
#### Usage: `/autoroles ingame (role)`
#### Arguments:
`role`: *(Optional)* Enter the role, or omit to remove.
>Assigns a temporary role to users identified as participants in an active match and automatically removes that role when they leave the match or the match concludes. Useful for highlighting in-game players for channel access, tournament coordination, or spectator overlays; note that the operation is restricted to admins and the chosen role must have appropriate permissions and hierarchy to be assignable and removable.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/autoroles inqueue`
#### Description
 Assign a role to players who are in the queue.
#### Usage: `/autoroles inqueue (role)`
#### Arguments:
`role`: *(Optional)* Enter the role, or omit to remove.
>Assigns the specified Discord role to all members currently in the queue, granting them the role's permissions and visibility. Commonly used to highlight queued players, control access to queue-specific channels, or trigger role-based automations; role changes are applied immediately and will remain until removed by queue exit processing or manually, so ensure the invoker has administrative privileges and the role's permissions are configured appropriately.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/autoroles leaderboardposition remove`
#### Description
 Removes a leaderboard position role.
#### Usage: `/autoroles leaderboardposition remove [role] [stat]`
#### Arguments:
`role`: *(Required)* Enter the role.\
`stat`: *(Required)* Stat which autoroles leaderboard position applies to.
>Removes an assigned leaderboard position role so that it will no longer be granted for the selected statistic and position. Commonly used to retire outdated or misassigned roles or to stop further automatic assignments after role changes; note that only administrators can perform this action and it does not retroactively strip the role from users who already have it.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/autoroles leaderboardposition set`
#### Description
 Adds a condition to give players a role based on leaderboard position.
#### Usage: `/autoroles leaderboardposition set [role] [stat] [lower_value] (upper_value)`
#### Arguments:
`role`: *(Required)* Enter the role.\
`stat`: *(Required)* Type of leaderboard stat to use.\
`lower_value`: *(Required)* (Inclusive) Leaderboard position range 1.\
`upper_value`: *(Optional)* (Inclusive) Leaderboard position range 2, or omit for no range.
>Adds a conditional rule that automatically assigns a server role to players whose position on a specified leaderboard stat falls within a defined numeric range. Admin-only, it evaluates player positions against the inclusive lower and optional upper bounds and grants or revokes the role accordingly; ensure the bot has permission to manage the target role and that role hierarchy permits assignment.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/autoroles notify`
#### Description
 Toggle sending a DM to players when their rank autorole changes.
#### Usage: `/autoroles notify [toggle]`
#### Arguments:
`toggle`: *(Required)* If players get a DM for role/rank changes.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`
>Enable or disable automatic direct messages sent to players whenever their autorole-based rank changes, so admins can control whether users receive notifications for promotions, demotions, or role assignments. Commonly used to reduce notification noise during bulk role updates or to ensure individual players are informed of rank changes; note that this setting only affects DM notifications (it does not change role assignments) and requires admin privileges to modify.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/autoroles refresh`
#### Description
 Recalculates all autoroles for players.
#### Usage: `/autoroles refresh`

>Recalculates autoroles for every player by re-evaluating each player's attributes against the active role criteria and applying any necessary changes to role assignments. Use after changing role rules, performing bulk membership updates, or correcting sync discrepancies—this operation can trigger multiple role updates at once and requires administrative privileges.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/autoroles reset`
#### Description
 Delete all auto role settings.
#### Usage: `/autoroles reset`

>Clears all configured automatic role assignments for the server, removing every auto-role rule so members will no longer be assigned roles automatically. Designed for administrators who need to reset role setups or resolve conflicting role automation; this action requires administrative permissions and is final, so verify intent before running it.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/autoroles stats remove`
#### Description
 Removes a condition where player roles are changed based on stats.
#### Usage: `/autoroles stats remove [role] [stat]`
#### Arguments:
`role`: *(Required)* Enter the role.\
`stat`: *(Required)* Stat which autoroles stats applies to.
>Removes a configured rule that automatically assigns or updates a player role based on a specified leaderboard stat, preventing any future automated role changes tied to that stat-role pairing. Intended for administrators, it halts further auto-assignments but does not retroactively remove roles already granted, making it useful when a stat is deprecated, a role is retired, or an existing tracking rule needs replacement.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/autoroles stats set`
#### Description
 (Ranks) Adds a condition in which player roles are changed based on stats.
#### Usage: `/autoroles stats set [role] [stat] [lower_rating] [upper_rating] (lower_lose_rating) (only_one_allowed)`
#### Arguments:
`role`: *(Required)* Role.\
`stat`: *(Required)* \
`lower_rating`: *(Required)* The lowest stat value required to gain the role.\
`upper_rating`: *(Required)* The upper stat value to lose the role.\
`lower_lose_rating`: *(Optional)* (Default: lower_rating) The stat value the player must fall below to lose the role.\
`only_one_allowed`: *(Optional)* (Default: True) If this role is assigned, no other stat autoroles will be allowed.
>Assigns and removes roles automatically by evaluating players' leaderboard statistics against configured rating ranges, so members receive roles that reflect their current rank or performance. Commonly used to grant rank-based recognition or access (for example, promoting top performers to a "Gold" role), it can enforce single-role membership to keep users at only their highest qualifying rank and runs during leaderboard updates; note that only administrators may create or modify these role conditions and overlapping ranges should be planned to avoid conflicts.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Reaction Roles
### `/reactionroles add`
#### Description
 Specify roles to assign when users react to the message.
#### Usage: `/reactionroles add [channel] [message_id] [role] [reaction] (remove_others) (queue_role)`
#### Arguments:
`channel`: *(Required)* Channel where message is.\
`message_id`: *(Required)* Message to add reaction to.\
`role`: *(Required)* Role to assign/remove.\
`reaction`: *(Required)* Reaction that corresponds to this role.\
`remove_others`: *(Optional)* If the user has this role, remove all other reactionroles in the message they have.\
`queue_role`: *(Optional)* Option role for `/roles` that the user will default to.
>Assigns a Discord role to users when they react to a specific message by mapping an emoji to a role; the bot adds the role when the reaction is added and removes it when the reaction is removed. This admin-only action can optionally strip other reaction-assigned roles on that message when a mapped reaction is chosen and can designate a default queue role for listings, making it useful for self-assignable role menus, event sign-ups, and controlled access workflows.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Ready Up
### `/readyup mode`
#### Description
 How players indicate they are ready to play a match.
#### Usage: `/readyup mode [mode]`
#### Arguments:
`mode`: *(Required)* How players show they are ready.\
&emsp;&emsp;&emsp; Options: `Ready Up Button, Join Lobby Voice Channel, Disabled`
>Configures how players declare readiness for matches by selecting one of three server-wide modes—Ready Up Button, Join Lobby Voice Channel, or Disabled—and applies that behavior to all current and future lobbies. Requires administrator privileges and immediately changes how the bot records and displays ready status (showing an in-lobby button, treating presence in the lobby voice channel as a ready signal, or disabling ready checks), so switch modes when you need to change matchmaking flow or voice-based coordination.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/readyup replaceinactive mode`
#### Description
 Changes how a replacement is found.
#### Usage: `/readyup replaceinactive mode [mode]`
#### Arguments:
`mode`: *(Required)* Replacement mode.\
&emsp;&emsp;&emsp; Options: `Closest Rated, Highest Rated, Queue Priority`
>Configures the replacement selection algorithm used when finding substitutes, toggling between a Detailed mode that evaluates multiple player attributes for precise, competitive matches and a Simple mode that applies fewer criteria for faster, broader matches. Restricted to server administrators to prevent accidental disruption; use Detailed for small or competitive queues and Simple for large or time-sensitive queues, with changes taking effect immediately for all subsequent replacement searches.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/readyup replaceinactive toggle`
#### Description
 Toggle replacing inactive players if possible.
#### Usage: `/readyup replaceinactive toggle [toggle]`
#### Arguments:
`toggle`: *(Required)* If automatic replacement is enabled.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`
>Enables or disables automatic replacement of inactive players after teams are created, causing the bot to swap unresponsive players for available or explicitly mentioned substitutes when possible. Useful for keeping matches moving and preserving team balance; note that only admins can change this setting and replacements only occur when suitable substitutes are available and players are mentioned after teams are created.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Rematch
### `/rematches`
#### Description
 (Default: true) Toggle the ability to rematch.
#### Usage: `/rematches [toggle]`
#### Arguments:
`toggle`: *(Required)* If you want rematches to be enabled or disabled.
>Toggles the queue's rematch feature, enabling or disabling players' ability to request and be offered immediate rematches after a match. As an admin-only control, disabling rematches suppresses rematch prompts and prevents automatic requeueing—useful for tournaments, enforcing cooldowns, or preventing rapid replays; changes take effect immediately across the guild.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Requeue
>For queue types that always start when reaching the queue size,
> requeue priority won't appear to make any changes.
> However, there are two specific queue starting modes where it will matter:
> 
> 1) `/queuetype Matchmaking`: When the matchmaker is running, it will use the overall sum of all player priorities,
> and use this value to increase the matchmaking range. For example, if the matchmaking range is 300 MMR, but there are
> two players with 100 priority each, the matchmaking range for that attempted match creation will be 500 MMR,
> making it more likely for that match to be created. If you want players with priority to ALWAYS be in the match, you
> can give them a very large priority (like 100,000), which ensures the matchmaker always considers their match as valid.
> 2) `/misc startwhen Forcestarted`: When matches can only be forcestarted, the number of players can exceed the maximum
> queue size. Players who join the queue with priority will take precedence in the queue over lower priority players.
### `/requeue condition`
#### Description
 Sets the condition for letting a player requeue.
#### Usage: `/requeue condition [condition]`
#### Arguments:
`condition`: *(Required)* Condition that must be met to requeue.\
&emsp;&emsp;&emsp; Options: `Must Vote, Winner Selected, None`
>Configures the condition the bot uses to evaluate whether a player may requeue, enforcing eligibility rules during requeue checks. Commonly used to prevent immediate reentries after leaving, enforce cooldowns or match-completion requirements, or create privileged exceptions; note that only administrators can modify this setting and changes immediately affect how requeue attempts are handled.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/requeue delay`
#### Description
 Delay people from queuing for the given duration after the condition is met.
#### Usage: `/requeue delay [seconds]`
#### Arguments:
`seconds`: *(Required)* Seconds to delay from queuing.
>Prevents users from joining the queue for a specified number of seconds after the triggering condition occurs by applying a temporary, timer-based lockout on queue actions. Intended for administrators to enforce cooldowns—useful for mitigating spam, controlling entry during high-demand periods, or pacing multi-stage events—and automatically lifts the restriction when the timer expires.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/requeue matchcancelled`
#### Description
 Specify if players get automatically requeued if a match is cancelled.
#### Usage: `/requeue matchcancelled [mode]`
#### Arguments:
`mode`: *(Required)* If requeue is automatic.\
&emsp;&emsp;&emsp; Options: `Disabled, Automatic`
>Configures whether players are automatically returned to the queue when a match is cancelled. The selected mode determines how affected players are handled—immediately requeued, held, or not requeued—and this setting applies to all subsequent cancellations; only server administrators can change it, making it useful for keeping matchmaking flowing during frequent cancellations or for preventing unwanted automatic reentries.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/requeue priority`
#### Description
 Give priority to players who requeue after a match.
#### Usage: `/requeue priority (value) (seconds)`
#### Arguments:
`value`: *(Optional)* (Default: 0) How much priority value to give.\
`seconds`: *(Optional)* (Default: 300) How many seconds to give this temporary priority value for.
>Grants a time-limited priority boost to players who requeue after a match, increasing their queue placement by the specified amount for a set duration. Intended for admins to encourage quick requeues and keep lobbies filled, this creates a temporary priority state that expires automatically to prevent long-term queue imbalance.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/requeue priorityrole add`
#### Description
 Allow players with the given role to gain priority for requeue.
#### Usage: `/requeue priorityrole add [role] (value)`
#### Arguments:
`role`: *(Required)* Priority role.\
`value`: *(Optional)* (Default: 100) Priority value to assign.
>Grants a specified server role a configurable requeue priority, causing members with that role to be placed ahead in the ordering when queues are rebuilt. Common uses include giving staff, donors, event VIPs, or tournament participants reduced wait times and helping manage load during peak periods; only administrators can assign or change these priorities and adjustments apply to new requeues immediately. Note that this only affects queue ordering and does not modify role permissions or other matchmaking behavior.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/requeue priorityrole remove`
#### Description
 Allow players with the given role to gain priority for requeue.
#### Usage: `/requeue priorityrole remove [role]`
#### Arguments:
`role`: *(Required)* Priority role.
>Revokes priority-for-requeue status from the specified role, removing it from the bot’s active priority-role list so members with that role no longer receive preferential placement in subsequent requeues. Reserved for administrators; commonly used to retire temporary event roles, correct accidental assignments, or restore fair queue order after role changes.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Require IGN
### `/requireign`
#### Description
 (Default: false) Require if players must set their IGN before they can queue.
#### Usage: `/requireign [toggle]`
#### Arguments:
`toggle`: *(Required)* If you want to require that users set their IGN.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`
>Enforces a requirement that users set their in‑game name (IGN) before they can join any queue; when enabled, join attempts from users without an IGN are rejected, and when disabled, IGN is optional. Intended for organizers who need accurate rosters or to prevent anonymous entries; this admin-only setting takes effect immediately for subsequent join attempts.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Required Votes
### `/requiredvotes autoresolution`
#### Description
 Sets the number of votes required for auto resolution.
#### Usage: `/requiredvotes autoresolution [type]`
#### Arguments:
`type`: *(Required)* The type of voting requirement to be used.\
&emsp;&emsp;&emsp; Options: `Half, Majority, One, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten`
>Sets the vote threshold the bot uses to automatically resolve queued items, interpreting the chosen type either as a fractional threshold (such as Half or Majority) or as a fixed numeric requirement (One through Ten). Intended for administrators to tune how readily items auto-resolve—use lower thresholds to speed resolution in active communities and higher thresholds to require broader consensus.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/requiredvotes cancel`
#### Description
 Sets the number of votes required for cancelling a game.
#### Usage: `/requiredvotes cancel [type]`
#### Arguments:
`type`: *(Required)* The type of voting requirement to be used.\
&emsp;&emsp;&emsp; Options: `Half, Majority, One, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten`
>Configures the number of affirmative votes required to cancel a scheduled or active game, updating the cancellation threshold the bot enforces when a vote-to-cancel is initiated. Accessible only to administrators, it changes how easily a cancellation can pass—raise the threshold for larger, competitive lobbies or lower it for casual groups that prefer quick cancellations.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/requiredvotes default`
#### Description
 Sets the default number of votes required.
#### Usage: `/requiredvotes default [type]`
#### Arguments:
`type`: *(Required)* The type of voting requirement to be used.\
&emsp;&emsp;&emsp; Options: `Half, Majority, One, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten`
>Sets the queue's default voting threshold used whenever a vote is created, choosing from predefined fixed-count or proportional options to define how many affirmative votes are required. Applies immediately to subsequent votes, requires administrative privileges to change, and is intended to align vote difficulty with server size and moderation policy to avoid overly strict or overly permissive decision thresholds.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/requiredvotes forcestart`
#### Description
 Sets the number of votes required for forcestarting a game.
#### Usage: `/requiredvotes forcestart [type]`
#### Arguments:
`type`: *(Required)* The type of voting requirement to be used.\
&emsp;&emsp;&emsp; Options: `Half, Majority, One, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten`
>Configures the vote threshold required to forcestart games of the selected type by updating the value the bot uses when tallying forcestart votes. This admin-only setting helps tune how easily lobbies can be forcibly started — lowering it allows quicker starts with fewer votes while raising it prevents premature forcestarts; changes take effect immediately for subsequent vote tallies.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/requiredvotes mvp`
#### Description
 Sets the number of votes required for getting MVP.
#### Usage: `/requiredvotes mvp [type]`
#### Arguments:
`type`: *(Required)* The type of voting requirement to be used.\
&emsp;&emsp;&emsp; Options: `Half, Majority, One, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten`
>Configures the server-wide threshold used to determine MVP eligibility by selecting from preset vote-count modes, adjusting how the bot evaluates and tallies votes when deciding an MVP. Restricted to administrators, this setting takes effect immediately so moderators can tighten or relax requirements for different events or community sizes; changing it will alter ongoing vote outcomes and should be coordinated with active votes to avoid confusion.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/requiredvotes winner`
#### Description
 Sets the number of votes required for picking a winner.
#### Usage: `/requiredvotes winner [type]`
#### Arguments:
`type`: *(Required)* The type of voting requirement to be used.\
&emsp;&emsp;&emsp; Options: `Half, Majority, One, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten`
>Configures the voting threshold used to determine a winner by applying one of several predefined requirement types (Half, Majority, or a fixed number from One to Ten) that set how many votes are needed to finalize selection. Intended for administrators to adjust selection strictness for different events—common uses include requiring a majority for casual draws or a fixed-count threshold for small-member giveaways—and changes take effect immediately for subsequent winner selections.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Requirements
### `/bannedroles add`
#### Description
 Add a banned role which can't join the queue.
#### Usage: `/bannedroles add [role]`
#### Arguments:
`role`: *(Required)* Enter the banned role.
>Adds a server role to the bot's banned-roles registry so members with that role are immediately prevented from creating, joining, or otherwise interacting with queue features. Intended for admins to exclude moderators, bots, or specific groups from queue participation; note that the restriction applies to all users holding the role and takes effect immediately until the role is removed.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/bannedroles remove`
#### Description
 Remove a banned role.
#### Usage: `/bannedroles remove [role]`
#### Arguments:
`role`: *(Required)* The role to remove from the banned roles list.
>Removes a specified server role from the list of roles the bot treats as banned, restoring that role’s ability to join queues and use queue-related features. Intended for administrators to lift role-based restrictions after policy changes or mistakes; the change takes effect immediately and requires appropriate administrative permissions.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/rolelimit remove`
#### Description
 Remove the limit for a role.
#### Usage: `/rolelimit remove [role]`
#### Arguments:
`role`: *(Required)* The role to remove the limit for.
>Removes the configured queue limit for a specified role, immediately allowing all current and future members of that role to no longer be constrained by role-based limits. Restricted to administrators, this is useful for lifting temporary caps during events, cleaning up obsolete role limits, or restoring normal access after testing; note the change takes effect immediately for all users and should be used cautiously to avoid overpopulating queues.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/rolelimit set`
#### Description
 Set the maximum number of players with this Discord role allowed in the queue.
#### Usage: `/rolelimit set [role] [limit] (roles)`
#### Arguments:
`role`: *(Required)* The primary role to limit.\
`limit`: *(Required)* The maximum number of players allowed.\
`roles`: *(Optional)* Optional comma-separated list of additional role IDs or mentions to include in the same limit.
>Enforces a maximum number of players holding a specified Discord role that are permitted to join the queue, with the option to group additional roles so they share that same cap. When active, users whose inclusion would exceed the cap are prevented from joining until spots free, and membership across the grouped roles is counted together to determine the current total, allowing administrators to prevent role-dominance and maintain balanced team composition.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/rolerequirement add`
#### Description
 Add a required role to enter this queue. Players can join if they have any of the roles.
#### Usage: `/rolerequirement add [role]`
#### Arguments:
`role`: *(Required)* Enter the required role.
>Adds a role requirement to the queue system, marking the specified role as mandatory for accessing or participating in queues and other restricted interactions. Intended for administrators to enforce role-based access control—common use cases include limiting participation to staff, verified members, or specific teams—and note that only users with administrative privileges can create or modify these requirements.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/rolerequirement remove`
#### Description
 Removed a required role to enter this queue.
#### Usage: `/rolerequirement remove [role]`
#### Arguments:
`role`: *(Required)* Enter the required role.
>Removes the specified role from the queue's configured role lists and any automated role-assignment or staff-role configurations so it no longer participates in those systems. Commonly used to revoke staff privileges or stop a role from being auto-assigned for game queues; note that current members who already hold the role will retain it until changed and the operation requires administrative privileges.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Results Channel
### `/resultschannel`
#### Description
 Sets the channel to post match results.
#### Usage: `/resultschannel [channel]`
#### Arguments:
`channel`: *(Required)* Enter the desired channel.
>Directs the bot to post match results to a specified server channel, causing all future automated result messages to be routed there instead of the previous destination. Typically used to centralize tournament or league result announcements; requires the bot to have permission to post in the chosen text channel and is restricted to administrators.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Roles
### `/roles`
#### Description
 (Default: None) Sets the roles for this queue, or omit to remove all.
#### Usage: `/roles (roles) (required)`
#### Arguments:
`roles`: *(Optional)* Enter the roles in the form Role,Role,Role,etc.\
`required`: *(Optional)* If roles are required to be chosen and enforced.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Schedule
### `/schedule cancelsetup`
#### Description
 (BETA) Cancels your currently active schedule setup.
#### Usage: `/schedule cancelsetup`

>Cancels an administrator’s active schedule setup session, immediately terminating the interactive configuration flow and clearing any staged setup state for that user. Use when a setup was started in error or needs to be aborted mid-process; note that only users with admin privileges can perform this action and the cancellation is immediate and cannot be undone, requiring a fresh setup to reconfigure scheduling.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/schedule delete`
#### Description
 (BETA) Delete a previously scheduled command.
#### Usage: `/schedule delete [scheduled_command]`
#### Arguments:
`scheduled_command`: *(Required)* The scheduled command to remove.
>Removes a previously scheduled task from the execution queue, preventing it from running at its scheduled time. Intended for administrators to cancel obsolete, duplicate, or erroneous scheduled commands by locating the matching schedule and cancelling its pending execution; cancellation affects only future runs and cannot undo executions that have already started.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/schedule repeat`
#### Description
 (BETA) Toggle if the scheduled command should repeat each time daily.
#### Usage: `/schedule repeat [scheduled_command] (repeat)`
#### Arguments:
`scheduled_command`: *(Required)* \
`repeat`: *(Optional)* If times should repeat after execution.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`
>Toggles the repetition state of a scheduled command so it either runs once or automatically re-schedules to execute at the same time each subsequent day. For administrators, it flips the schedule's repeat flag so the scheduler will queue the command daily when enabled or stop re-queuing when disabled, useful for enabling or disabling recurring reminders and daily announcements.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/schedule setup`
#### Description
 (BETA) Start scheduling the execution of any NeatQueue command.
#### Usage: `/schedule setup`

>Schedules execution of any NeatQueue command at a specified future time or on a recurring cadence, enabling administrators to automate tasks such as periodic announcements, queue resets, or maintenance actions. Operates with admin-only permissions, validates and registers the job with the bot's scheduler, triggers the command at the appointed times, and exposes status and cancellation controls for administrators to review or remove pending schedules.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/schedule time add`
#### Description
 (BETA) Specify an execution time for the scheduled command.
#### Usage: `/schedule time add [scheduled_command] [time] (timezone)`
#### Arguments:
`scheduled_command`: *(Required)* The scheduled command to add an execution time for.\
`time`: *(Required)* Time for the command to be executed.\
`timezone`: *(Optional)* (Default: /timezone) Respective timezone for the inputted time.
>Schedules a previously configured scheduled command to execute at a specified moment by validating and normalizing the supplied time and timezone, converting it to the bot's scheduling reference, and enqueuing the job for execution. Commonly used to set one-off maintenance tasks, timed announcements, or workflow triggers; administrative privileges are required and the command will reject ambiguous or unsupported time inputs.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/schedule time list`
#### Description
 (BETA) List the scheduled times for the command.
#### Usage: `/schedule time list [scheduled_command]`
#### Arguments:
`scheduled_command`: *(Required)* The scheduled command to list execution times.
>Displays the upcoming execution times for a specified scheduled command by parsing its schedule expression and expanding it into the next concrete timestamps. Intended for administrators to verify, audit, and troubleshoot scheduling by confirming next runs and detecting disabled or expired schedules; results reflect the schedule’s current configuration and server timezone.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/schedule time remove`
#### Description
 (BETA) Remove an execution time for the scheduled command.
#### Usage: `/schedule time remove [scheduled_command] [time]`
#### Arguments:
`scheduled_command`: *(Required)* The scheduled command to remove an execution time for.\
`time`: *(Required)* Time for the command to be executed.
>Removes a configured execution time from a scheduled command's run list, cancelling that specific future occurrence and recalculating remaining executions so subsequent runs proceed as intended. Intended for administrators to tidy schedules by eliminating duplicate, obsolete, or misconfigured run times; note that this action affects only the specified execution time and requires admin privileges.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Select Winner
### `/outcome cancel`
#### Description
 Cancel the given game.
#### Usage: `/outcome cancel [match_number]`
#### Arguments:
`match_number`: *(Required)* The match number.
>Cancels the specified match by marking its status as cancelled, notifying all involved players and moderators, and freeing any reserved participant slots so the match is removed from active queues and scheduling displays. Intended for administrators to handle no-shows, rule infractions, or scheduling conflicts; cancelled matches cannot be resumed and must be recreated if replay is desired.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/outcome selectwinner`
#### Description
 Sets the winner for the given game.
#### Usage: `/outcome selectwinner [match_number] [team_num]`
#### Arguments:
`match_number`: *(Required)* The match number.\
`team_num`: *(Required)* The team that won.
>Sets the winner for a specified match and updates all associated tournament state. Restricted to administrators, it validates the match and team identifiers, records the outcome, and triggers downstream actions such as advancing brackets, recalculating standings, and posting notifications to relevant channels; intended for finalizing results or correcting previously recorded winners.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/outcome tie`
#### Description
 Mark the given game as a tie.
#### Usage: `/outcome tie [match_number]`
#### Arguments:
`match_number`: *(Required)* The match number.
>Marks the specified match as a tie, updating the match status and notifying the involved players and the queue of the resolution. Intended for admins to resolve matches without a winner—such as mutual agreement, disconnections, or adjudicated draws—and it prevents further result submissions for that match while ensuring the tie is accounted for in standings and queue continuity.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Server Stats
### `/serverstats channelnames games`
#### Description
 Show how many games have been played by renaming the specified channel.
#### Usage: `/serverstats channelnames games (channel) (format)`
#### Arguments:
`channel`: *(Optional)* Channel to rename, or omit to remove.\
`format`: *(Optional)* Format for channel name. Indicate a $ for the replacement. Ex: "Games: $".
>Renames the specified channel to display how many games have been played, applying a configurable format string to inject the count into the channel name. Designed for server administrators to maintain visible game counters (total or per-event) in channel names; requires channel-manage permissions and will overwrite the existing channel name, so verify bot permissions and chosen format before running.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/serverstats channelnames ingame`
#### Description
 Show how many players are in game by renaming the specified channel.
#### Usage: `/serverstats channelnames ingame (channel) (format)`
#### Arguments:
`channel`: *(Optional)* Channel to rename, or omit to remove.\
`format`: *(Optional)* Format for channel name. Indicate a $ for the replacement. Ex: "In Game: $".
>Displays the current number of players marked as in-game by renaming a specified channel to a configurable format that reflects the live count. Ideal for at-a-glance server activity or lobby/status channels for players and viewers; it keeps the channel label updated as counts change and requires administrative permissions to modify channel names.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/serverstats channelnames inqueue`
#### Description
 Show how many players are in queue by renaming the specified channel.
#### Usage: `/serverstats channelnames inqueue (channel) (format)`
#### Arguments:
`channel`: *(Optional)* Channel to rename, or omit to remove.\
`format`: *(Optional)* Format for channel name. Indicate a $ for the replacement. Ex: "In Queue: $".
>Renames a specified server channel to reflect the current number of players waiting, inserting the queue count into a customizable format so the information appears directly in the channel name. Commonly used to give staff and players at-a-glance visibility of queue size in lobbies or event channels; requires administrative privileges to change channel names and will update as the queue changes, so use a concise format to avoid exceeding Discord’s channel name length limits.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/serverstats channelnames players`
#### Description
 Show the total number of players by renaming the specified channel.
#### Usage: `/serverstats channelnames players (channel) (format)`
#### Arguments:
`channel`: *(Optional)* Channel to rename, or omit to remove.\
`format`: *(Optional)* Format for channel name. Indicate a $ for the replacement. Ex: "Players: $".
>Displays the total number of players by calculating the current player count and renaming a specified channel to a formatted label that includes that count. Useful for surfacing live participation on lobby, queue, or matchmaking channels, it runs with administrator privileges and updates the channel name as counts change; ensure the chosen format produces a valid Discord channel name and respects character limits and naming rules.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/serverstats channelnames users`
#### Description
 Show how many users are in the server by renaming the specified channel.
#### Usage: `/serverstats channelnames users (channel) (format)`
#### Arguments:
`channel`: *(Optional)* Channel to rename, or omit to remove.\
`format`: *(Optional)* Format for channel name. Indicate a $ for the replacement. Ex: "Users: $".
>Displays the current server member count by renaming a specified channel to include the count. It fetches the live member total and updates the channel name with a customizable format string, requiring administrator permissions to modify channel names and respecting Discord name-length and rate-limit restrictions.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/serverstats info`
#### Description
 View all queue names in the server.
#### Usage: `/serverstats info (hidden)`
#### Arguments:
`hidden`: *(Optional)* If you want the stats to be hidden.
>Displays a consolidated list of all queue names currently registered on the server, returning them in a single, compact response visible only to administrators. Useful for auditing available queues, verifying naming conventions, and identifying duplicates or unused queues; note that output is restricted to admin users and shows only queue names, not their contents.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Setup
### `/setup`
#### Description
 Starts the interactive setup.
#### Usage: `/setup`

>Configures the server for NeatQueue by creating and organizing the required channels, roles, and default settings and applying the permission structure needed for queue operations. Commonly used when first enabling the bot or after permission/channel changes; requires administrator privileges and performs conflict checks to avoid overwriting existing channels or roles, preserving customizations where possible.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Show MMR in Name
### `/ratinginname format`
#### Description
 (Default: '- ($)') Sets the format for ratings in nicknames.
#### Usage: `/ratinginname format [format] [location]`
#### Arguments:
`format`: *(Required)* How the rating should be formatted. A '$' indicates the player's rating.\
`location`: *(Required)* \
&emsp;&emsp;&emsp; Options: `Prefix, Suffix`
>Sets the template used to display player ratings in member nicknames and inserts the rendered rating as either a prefix or suffix. Accepts a format string where a '$' character is replaced with each player's rating and a location option chooses Prefix or Suffix, allowing administrators to standardize nickname appearance across the server for lobbies and leaderboards; only administrators can change this setting.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/ratinginname queuenames`
#### Description
 Sets the queue names to use in retrieving player stats, or omit to reset.
#### Usage: `/ratinginname queuenames (names)`
#### Arguments:
`names`: *(Optional)* The queue names separated by ',' to use for inserting ratings into '$' indicators in the format.
>Configures the set of queue names used to determine which game queues are considered when retrieving player statistics. Supplying names replaces the active queue list so ratings are inserted into '$' indicators only for those queues, while omitting names clears the custom list and reverts to the default selection; this is restricted to administrators to maintain consistent rating displays.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/ratinginname removeallnicknames`
#### Description
 Removes all nicknames from all members.
#### Usage: `/ratinginname removeallnicknames`

>Removes all custom nicknames from every server member, reverting them to their default usernames. Intended for quickly resetting naming conventions after events or mass renames, it attempts to clear each member's nickname but will skip members the bot cannot modify (due to role hierarchy or permissions) and may span several seconds as it respects Discord rate limits; ensure you have administrator-level rights before running this operation.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/ratinginname toggle`
#### Description
 Enable or disable showing player MMR in their nickname.
#### Usage: `/ratinginname toggle [toggle]`
#### Arguments:
`toggle`: *(Required)* If ratings should be shown in name.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`
>Toggles display of player MMR in member nicknames by adding or removing an MMR suffix on each player's nickname so ratings are visible at a glance. Restricted to server administrators, this is useful for public leaderboards or privacy modes; note the bot requires Manage Nicknames permission and cannot change nicknames for users with higher roles or protected accounts, so some members may be skipped.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Simulate
### `/simulate`
#### Description
 Simulate the MMR distribution for the current configuration.
#### Usage: `/simulate (players) (matches)`
#### Arguments:
`players`: *(Optional)* The number of players to simulate.\
`matches`: *(Optional)* The number of matches to simulate.
>Simulates the MMR distribution for the current configuration by generating a pool of virtual players and running the specified number of matches using the configured matchmaking and rating-adjustment rules, then outputs a histogram and summary statistics of the resulting MMRs. Intended for admins to evaluate balance, tuning, and expected volatility; results are stochastic and depend on the number of simulated matches and random seed, and they do not modify live player ratings.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Spectator Role
### `/spectatorrole add`
#### Description
 Specify a spectator role which can join any voice channel.
#### Usage: `/spectatorrole add [role] (can_speak)`
#### Arguments:
`role`: *(Required)* Spectator role.\
`can_speak`: *(Optional)* Can this role speak in the channel?.
>Registers the specified spectator role so members with that role can join any voice channel regardless of normal queue restrictions, and optionally grants them the ability to speak while in those channels. Restricted to server administrators, this is useful for moderators, VIPs, or event staff to unobtrusively monitor or participate in sessions without affecting queue order; note it does not override Discord channel-level deny permissions and should be used sparingly to preserve fair queue behavior.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/spectatorrole remove`
#### Description
 Remove's a spectator role.
#### Usage: `/spectatorrole remove [role]`
#### Arguments:
`role`: *(Required)* Spectator role.
>Removes the specified role from the set of spectator roles, preventing members with that role from being treated as spectators by the bot. Intended for server administrators to revoke spectator privileges when roles change or are deprecated; note that the change takes effect immediately and requires administrator-level permissions.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Staff
### `/staffrole add`
#### Description
 Add a staff role that grants access to commands.
#### Usage: `/staffrole add [role] [template]`
#### Arguments:
`role`: *(Required)* Staff role.\
`template`: *(Required)* If the role gets access to all commands or not.\
&emsp;&emsp;&emsp; Options: `User Commands Only, All Commands`
>Adds a staff role that grants access to staff-only bot commands by associating the specified server role with a permissions template. Intended for administrators to create role-based access levels (for example, moderators or support staff), it ensures members with the assigned role can execute privileged commands while others cannot, and supports using distinct templates to control which command groups each staff role may access.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/staffrole command allow`
#### Description
 Grants the staff role access to the given command.
#### Usage: `/staffrole command allow [role] [command]`
#### Arguments:
`role`: *(Required)* Staff role.\
`command`: *(Required)* The command to grant access to.
>Grants a specified staff role permission to execute a particular bot command by updating the bot’s role-permission settings and enforcing those checks at command invocation. Intended for administrators to delegate command access to moderators or temporary staff; changes take effect immediately for all members with the role, so choose roles carefully to avoid accidental privilege escalation.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/staffrole command deny`
#### Description
 Removes the staff role's access to the given command.
#### Usage: `/staffrole command deny [role] [command]`
#### Arguments:
`role`: *(Required)* Staff role.\
`command`: *(Required)* The command to remove access from.
>Revokes a staff role's permission to execute a specified bot command, preventing members with that role from invoking it. Commonly used to restrict access during moderation, limit feature exposure to trusted staff, or temporarily disable actions for safety; only administrators can perform this change and it takes effect immediately for all members with the role.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/staffrole list`
#### Description
 List all configured staff roles.
#### Usage: `/staffrole list`

>Displays all roles designated as staff in the server configuration, showing each role's name and relevant attributes such as staff flags or a brief permission summary. Provides administrators a quick audit of which roles receive staff privileges so they can verify assignments and spot misconfigurations or omissions.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/staffrole remove`
#### Description
 Remove a staff role.
#### Usage: `/staffrole remove [role]`
#### Arguments:
`role`: *(Required)* Staff role.
>Removes a specified role from the bot’s configured staff roles, immediately revoking staff privileges tied to that role across queues, staff listings, and staff-restricted actions. Intended for administrators when rotating duties or cleaning up stale staff assignments; note this does not change Discord role permissions themselves, so members will lose bot-recognized staff access as soon as the role is removed.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/staffrole reset`
#### Description
 Resets the staff role to starting permissions.
#### Usage: `/staffrole reset [role]`
#### Arguments:
`role`: *(Required)* Staff role.
>Restores the specified staff role's permissions to the bot's original default configuration, overwriting any custom changes so the role matches the expected starting permission set. Intended for quickly recovering from misconfigured staff roles or undoing experimental permission edits; restricted to server administrators and only modifies role permissions (it does not alter role members or server-wide settings).
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Start From Voice Channel
### `/startfromvc`
#### Description
 Creates a queue using all players in the given channel.
#### Usage: `/startfromvc [voice_channel]`
#### Arguments:
`voice_channel`: *(Required)* The voice channel to start a queue from.
>Populates the queue by collecting every player currently connected to the specified voice channel and enqueuing them in the order they appear in that channel. Designed for administrators to rapidly assemble match rosters or restart queues after breaks; it skips bots and users without an active voice connection and preserves channel order to maintain expected team balance.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Start Queue
### `/startqueue`
#### Description
 Starts a queue for the current channel.
#### Usage: `/startqueue [queuename] [teamsize] (numberofteams)`
#### Arguments:
`queuename`: *(Required)* Name for the queue.\
`teamsize`: *(Required)* Team size.\
`numberofteams`: *(Optional)* Number of teams in a match.
>Starts a managed player queue in the current channel by creating the queue with the specified name and team configuration and posting an interactive message that participants use to join or leave. Commonly used by admins to organize pickup matches, scrims, or tournaments — it enforces team sizes, can limit the number of teams per match, and automatically groups players into teams when the queue fills or an admin launches a match; note that only users with administrative permissions can initialize the queue.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Starting MMR
### `/startingmmr remove`
#### Description
 Removes the starting mmr for the given role.
#### Usage: `/startingmmr remove [role]`
#### Arguments:
`role`: *(Required)* The role to remove starting MMR from.
>Removes the starting MMR associated with a specified role, preventing members of that role from receiving a predefined initial rating during match assignment and queue operations. Intended for admins to retire or correct role-specific starting values; the change takes effect immediately for future queues and can be reversed by assigning a new starting MMR to the role when desired.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/startingmmr set`
#### Description
 Sets the starting mmr for the given role.
#### Usage: `/startingmmr set [mmr] (role)`
#### Arguments:
`mmr`: *(Required)* The starting mmr value.\
`role`: *(Optional)* The role.
>Sets the starting MMR value associated with a specified server role so that users with that role are assigned that baseline rating during matchmaking and queue placement. Admin-only; commonly used to give groups or new players a fair initial rating or to adjust role-based balance, with changes taking effect immediately for subsequent matchmaking.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Stats Config
### `/statsconfig graph games`
#### Description
 Sets the maximum number of games to show in /stats.
#### Usage: `/statsconfig graph games (limit)`
#### Arguments:
`limit`: *(Optional)* (Default: 30) Max number of games to show.
>Sets the maximum number of games shown in /stats, determining how many recent matches are included when generating statistics. Restricted to administrators, this setting is used to keep stats output concise or focused on recent activity and should be set to a reasonable value to avoid excessively long or overly truncated reports.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/statsconfig graph xaxis`
#### Description
 Sets the x-axis labels type in /stats.
#### Usage: `/statsconfig graph xaxis [data]`
#### Arguments:
`data`: *(Required)* (Default: Dates) Which data to show on the x-axis in the stats graph.\
&emsp;&emsp;&emsp; Options: `Dates, Games`
>Sets the x-axis label format used in statistical graphs, controlling how data points are labeled and grouped on rendered charts. It updates the graph configuration so subsequent statistics outputs present axis labels according to the selected format; this change is restricted to administrators and affects only the presentation of labels, not the underlying data.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/statsconfig hidestats`
#### Description
 Sets whether stats are forced to be hidden (only shown to the user).
#### Usage: `/statsconfig hidestats [toggle]`
#### Arguments:
`toggle`: *(Required)* If you want the stats to be always hidden.
>Enforces whether queue statistics are concealed from other users by suppressing public stat displays and restricting stat responses to the issuing administrator. Commonly used to maintain privacy during testing or when sensitive metrics should not be publicly displayed; only administrators can change this setting and it remains active until toggled again.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/statsconfig rankupautorole`
#### Description
 Sets what autorole criteria is used for displaying rank ups in /stats.
#### Usage: `/statsconfig rankupautorole [stat]`
#### Arguments:
`stat`: *(Required)* Stat key to use for rank-up autorole (supports built-in and parsed stats).
>Configures which autorole criterion is used to determine and display member rank-ups in stats, so rank progression and upcoming/achieved ranks are evaluated against the selected autorole metric. Admin-only; use this to align rank-up reporting with your server’s chosen progression metric and ensure stats present the appropriate autorole-based thresholds.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Team Creation
### `/teamselection reshuffle`
#### Description
 Sets whether players can reshuffle teams in random team selection.
#### Usage: `/teamselection reshuffle [toggle]`
#### Arguments:
`toggle`: *(Required)* Whether reshuffling is enabled or disabled.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`
>Controls whether players can reshuffle teams during random team selection and is restricted to administrators for changing reshuffle behavior. When enabled, players may reshuffle teams (optionally limited to a set maximum number of reshuffles per match); when disabled, reshuffling is prevented so teams remain as initially generated.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/teamselection set`
#### Description
 Choose how teams will be picked.
#### Usage: `/teamselection set`

>Configures the method used to form teams for a queue, letting administrators select among available selection algorithms—random draw, captain picks, skill-based balancing, or manual assignment—and set team parameters such as number and size. Commonly used to prepare queues for competitive or casual play, enforce fair composition, or enable organizer-driven picks; note that changes take effect for subsequent team formations and require administrative privileges.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Team Names
### `/teamnames captains`
#### Description
 If team names should be the captains names, if applicable.
#### Usage: `/teamnames captains [toggle]`
#### Arguments:
`toggle`: *(Required)* Toggle team names being the captain's names.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`
>Toggles whether team labels display the assigned captain's username in place of a custom or autogenerated team name, substituting the captain's name only when a captain is present. Commonly used by administrators to make teams immediately identifiable during captain drafts or match coordination; enabling this affects all team views that support captain attribution and leaves names unchanged for teams without an assigned captain.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/teamnames set`
#### Description
 Specify the names of each team, or omit for the default behavior..
#### Usage: `/teamnames set (team_names)`
#### Arguments:
`team_names`: *(Optional)* Comma separated list of team names. Ex: Team 1,Team 2,...
>Configures the bot's active team labels by replacing the default team names with a custom set or restoring the default set when omitted; changes are applied immediately to all queue rotations, role assignments, and display outputs. Restricted to administrators, this ensures consistent labeling across channels and rounds, prevents mismatches during team-based operations, and should be used whenever team naming or composition changes to keep notifications and assignments accurate.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Team Size
### `/teamsize`
#### Description
 Sets the size for each team.
#### Usage: `/teamsize [size]`
#### Arguments:
`size`: *(Required)* The team size.
>Sets the number of members per team used for all subsequent team generation and queue-balancing operations so teams are created and filled according to the configured size. Typically used by administrators to standardize team composition for events, scrims, or matchmaking; this action is restricted to admins and applies only to future allocations, so change the size before forming or refreshing active queues to ensure consistent results.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Temporary Setup Channels
### `/tempchannels name`
#### Description
 (Default: queue-$) Naming format for temporary setup channels.
#### Usage: `/tempchannels name [name_format]`
#### Arguments:
`name_format`: *(Required)* Channel format, where $ will be replaced with the match number.
>Configures the naming pattern for temporary setup channels by accepting a format string where each $ placeholder is replaced with the match number when channels are created. Useful for producing consistent, sequential channel names to keep queues, match rooms, or region-tagged lobbies organized; ensure the format includes the placeholder so generated names remain unique and increment properly. This action is restricted to administrators.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/tempchannels permissions set`
#### Description
 Specify a permission to set for a role when creating the temporary channel.
#### Usage: `/tempchannels permissions set [role] [permission] [value]`
#### Arguments:
`role`: *(Required)* Role to modify permissions for.\
`permission`: *(Required)* Permission name.\
`value`: *(Required)* Permission value.\
&emsp;&emsp;&emsp; Options: `Deny, Allow, Default`
>Configures a specific permission on a role that will be applied to newly created temporary channels, controlling capabilities such as speaking, viewing, or managing those channels. Requires administrative privileges; commonly used to grant moderators channel management rights or restrict access for certain roles, and note that changes affect only channels created after the setting is applied and do not modify existing channels.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/tempchannels toggle`
#### Description
 (Default: Enabled) Sets whether to create a temporary text channel for setup.
#### Usage: `/tempchannels toggle [mode]`
#### Arguments:
`mode`: *(Required)* If the temporary setup channels are enabled.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`
>Controls whether the bot creates a temporary, short-lived text channel specifically for setup; when enabled, a private ephemeral channel is spawned to isolate setup messages and is removed after setup completes, and when disabled, setup occurs in existing channels without creating additional channels. Useful for keeping configuration conversations separate and reducing channel clutter, and restricted to server administrators.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/tempchannels type`
#### Description
 (Default: Text Channels) Specify if the temp channels are threads or normal channels.
#### Usage: `/tempchannels type [type]`
#### Arguments:
`type`: *(Required)* If the new channels should be text channels, or threads of this channel.\
&emsp;&emsp;&emsp; Options: `Text Channels, Threads`
>Configures how temporary channels are created on the server, selecting between standalone text channels or threads attached to the invoking channel. Useful for servers that prefer persistent category channels for structured queues or lightweight threads to reduce channel clutter; only administrators can change this setting and it applies to all subsequent temporary channels.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Test
### `/test`
#### Description
 Enables testing mode which allows for duplicate queue joining.
#### Usage: `/test`

#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Ties
### `/ties`
#### Description
 Sets whether tieing is an option for game outcomes.
#### Usage: `/ties [toggle]`
#### Arguments:
`toggle`: *(Required)* Whether to show the tie option.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Timers
### `/timer afk`
#### Description
 Toggle kicking players for inactivity.
#### Usage: `/timer afk [toggle] (timer)`
#### Arguments:
`toggle`: *(Required)* Toggle.\
`timer`: *(Optional)* Enter the AFK timer in seconds (Default: 3600).
>Enables automatic enforcement against inactive users by monitoring activity and removing members who exceed the configured AFK timeout. Designed for administrators to keep queues and lobbies moving during events, it prevents stalled sessions by kicking prolonged idle players but should be used cautiously to avoid removing temporarily inactive participants and requires administrator privileges.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/timer matchcleanup`
#### Description
 (Default: 5400) Sets the timeout before a running game is finished.
#### Usage: `/timer matchcleanup [seconds]`
#### Arguments:
`seconds`: *(Required)* Enter the time in SECONDS.
>Configures the inactivity timeout that determines when a running game is considered finished; when that timeout elapses with no activity the bot automatically marks the match finished and triggers the match cleanup and finalization routines. Useful for tuning queue pacing—shorten for fast-turnover events or lengthen for extended matches—be cautious setting it too short as active games may be closed prematurely, and only administrators can change this setting (default: 5400 seconds).
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/timer queuemessage`
#### Description
 (Default: 3) Sets the delay for when a new queue message comes up.
#### Usage: `/timer queuemessage [seconds]`
#### Arguments:
`seconds`: *(Required)* New message delay.
>Sets the delay interval for when new queue messages are posted, adjusting the bot's scheduling so each new message appears after the specified number of seconds. Intended for administrators to tune notification cadence—useful for slowing message frequency in high-traffic servers or accelerating updates during active sessions; changes take effect immediately and apply to all subsequent queue messages.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/timer queuereset`
#### Description
 (Default: 3600) Sets the time before the queue is reset.
#### Usage: `/timer queuereset [seconds]`
#### Arguments:
`seconds`: *(Required)* Enter the time in SECONDS.
>Sets the interval before the queue is automatically reset by starting a countdown timer that clears the queue when it expires. Commonly used to enforce periodic clearing between sessions or prevent stale queues; note that only administrators can change this setting and choosing very short intervals can disrupt active queues (default: 3600 seconds).
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/timer votes`
#### Description
 (Default: 60) Sets the timeout for voting menus.
#### Usage: `/timer votes [seconds]`
#### Arguments:
`seconds`: *(Required)* 
>Sets the timeout applied to all voting menus, changing how long polls remain open before automatically closing (default: 60 seconds). Restricted to server administrators, this adjusts the countdown timer used by voting interfaces so longer timers suit deliberative polls and shorter timers keep rapid rotations; note that changes apply to new voting menus immediately and do not alter polls already in progress.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/timer winnervotemessage`
#### Description
 (Default: 0) Sets the delay before enabling the winner voting message.
#### Usage: `/timer winnervotemessage [seconds]`
#### Arguments:
`seconds`: *(Required)* Enter the time in SECONDS.
>Configures the delay timer that determines how long the bot waits after a contest or draw finishes before enabling the winner voting message, allowing moderators time to verify results or giving entrants a chance to respond. This is an admin-only setting; a value of zero enables voting immediately, while larger delays prevent premature voting and apply to subsequent winner announcements.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Timezone
### `/timezone`
#### Description
 (Default: 'US/Eastern') Sets the server's timezone.
#### Usage: `/timezone [timezone]`
#### Arguments:
`timezone`: *(Required)* Server's timezone.
>Sets the server's timezone used for scheduled events, timestamps, and all time-based calculations across the bot, applying the selected timezone server-wide so displayed times and scheduling align with your locale. Restricted to administrators, the setting defaults to US/Eastern and affects future displays and timing without retroactively changing previously recorded timestamps.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Tournaments
### `/tournament account`
#### Description
 Link your server to challonge using your username and api key.
#### Usage: `/tournament account [challonge_username] [challonge_api_key]`
#### Arguments:
`challonge_username`: *(Required)* Challonge username.\
`challonge_api_key`: *(Required)* Challonge API Key from https://challonge.com/settings/developer.
>Links the Discord server to a Challonge account by validating the provided username and API key with the Challonge API and enabling the bot to perform authenticated tournament operations for that server. Admin-restricted to prevent misuse; commonly used to centralize bracket creation, match reporting, and participant syncing, and important to ensure the credentials are valid and tied to the intended Challonge account since they will be used for all future Challonge interactions on the server.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/tournament config autocreatematches`
#### Description
 (BETA) Toggle automatically creating new matches when ready.
#### Usage: `/tournament config autocreatematches [mode] (tournament_url)`
#### Arguments:
`mode`: *(Required)* Toggle automatically creating matches.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`\
`tournament_url`: *(Optional)* Tournament to edit.
>Toggles automatic match creation for a specified tournament, causing the bot to generate new matches whenever queue conditions and tournament constraints are met so rounds progress without manual intervention. Ideal for busy events or leagues to streamline flow and reduce admin overhead; note this is an admin-only BETA feature, changes take effect immediately and may exhibit edge-case behavior.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/tournament config autocreatenewtournament`
#### Description
 (BETA) Toggle automatically creating new tournaments.
#### Usage: `/tournament config autocreatenewtournament [mode] (tournament_url)`
#### Arguments:
`mode`: *(Required)* Change if new tournaments are automatically created.\
&emsp;&emsp;&emsp; Options: `On Start, On Completion, Never`\
`tournament_url`: *(Optional)* Tournament to edit.
>Toggles automatic creation of new tournaments for the server by enabling or disabling background monitoring of a provided tournament URL. When enabled, the bot watches the configured URL and automatically creates new tournament instances when a new event is detected—useful for automating recurring series or provisioning league events—and should be managed by administrators since it affects server-wide tournament behavior.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/tournament config autostartonfill`
#### Description
 (BETA) Toggle automatically starting the tournament when filled.
#### Usage: `/tournament config autostartonfill [mode] (tournament_url)`
#### Arguments:
`mode`: *(Required)* Toggle automatically starting on fill.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`\
`tournament_url`: *(Optional)* Tournament to edit.
>Toggles automatic starting of a tournament when participant capacity is reached by monitoring the tournament’s participant count and issuing the start action as soon as it becomes full. Intended for admins who want tournaments to begin immediately without manual intervention—useful for high-traffic events or recurring queues—and note that enabling it applies to the specified tournament and only affects future fills.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/tournament config details`
#### Description
 (BETA) Change the tournament details shown in the queue message.
#### Usage: `/tournament config details (details) (tournament_url)`
#### Arguments:
`details`: *(Optional)* Tournament details, or omit to remove.\
`tournament_url`: *(Optional)* Tournament to edit.
>Updates the tournament details displayed in the queue message, replacing or clearing the details field shown to participants and targeting a specific tournament message when a tournament URL is provided. Intended for admins to keep queue info accurate—use to add event notes, announce scheduling or rule changes, or remove outdated info; changes are applied immediately to the visible queue message.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/tournament create`
#### Description
 (BETA) Create a new tournament and shows signup buttons.
#### Usage: `/tournament create [maximum_participants] (tournament_type) (auto_start_on_fill) (auto_create_matches) (auto_create_new_tournament) (team_size) (name) (url) (details) (forfeit_timer_sec)`
#### Arguments:
`maximum_participants`: *(Required)* Maximum number of teams that can register.\
`tournament_type`: *(Optional)* (Default: Single Elimination) Tournament type.\
&emsp;&emsp;&emsp; Options: `single_elimination, double_elimination, round_robin, swiss`\
`auto_start_on_fill`: *(Optional)* (Default: True) Automatically start the tournament when the participant capacity is hit.\
`auto_create_matches`: *(Optional)* (Default: True) If the bot should automatically create matches when ready.\
`auto_create_new_tournament`: *(Optional)* (Default: On Completion) Automatically create a new tournament when this one starts/ends?.\
&emsp;&emsp;&emsp; Options: `On Start, On Completion, Never`\
`team_size`: *(Optional)* Number of players on each team.\
`name`: *(Optional)* The tournament name, also the name of the queue/stats storage for determining seeding.\
`url`: *(Optional)* Challonge tournament URL, or omit to auto generate.\
`details`: *(Optional)* Any extra details to show in the queue message.\
`forfeit_timer_sec`: *(Optional)* How longer players have to join the match (in seconds) before forfeiting.
>Creates a fully configurable tournament, posts a persistent signup message with interactive Join/Leave buttons, and optionally generates or links to a Challonge URL for bracket viewing. Internally the bot records the tournament settings with its scheduler and matchmaker, enforces participant limits and team sizes, manages forfeit timers, handles automatic behaviors (start on fill, auto-create matches or successor tournaments), applies payout/entry options and third-place handling, and restricts execution to administrators.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/tournament delete`
#### Description
 (BETA) Deletes the tournament.
#### Usage: `/tournament delete (tournament_url)`
#### Arguments:
`tournament_url`: *(Optional)* Tournament to delete.
>Deletes the specified tournament and removes all associated queue entries, scheduled tasks, and permission links so it no longer appears or can be accessed on the server. As an immediate, admin-only action, removal is irreversible and will cancel pending match schedules and notify affected channels and participants of the deletion.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/tournament refresh`
#### Description
 (BETA) Refresh necessary data from challonge and start any required matches.
#### Usage: `/tournament refresh (tournament_url)`
#### Arguments:
`tournament_url`: *(Optional)* Tournament to refresh.
>Refreshes tournament data from Challonge, reconciles participant and match statuses, and initiates any matches that are ready to start. Intended for administrators to force synchronization when external changes occur or when matches become stalled or fail to start automatically.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/tournament start`
#### Description
 (BETA) Start the tournament.
#### Usage: `/tournament start (tournament_url)`
#### Arguments:
`tournament_url`: *(Optional)* Tournament to start.
>Starts a tournament by validating the provided tournament URL, confirming the requesting user has admin privileges, and transitioning the event into an active state. Once activated it queues the initial matches, posts start announcements to the channel and participants, and enforces BETA restrictions (admin-only access and evolving behavior), so invoke it when the bracket is finalized and ready to run.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/tournament startmatches`
#### Description
 (BETA) Starts the next set of ready matches.
#### Usage: `/tournament startmatches (tournament_url)`
#### Arguments:
`tournament_url`: *(Optional)* Tournament to start matches for.
>Starts the next set of matches marked ready in a specified tournament by pushing them into the active match queue, notifying participants, and assigning available servers or game instances. Intended for admins to resume or accelerate tournament progress, it skips non-ready matches and returns status feedback for any matches that could not be started due to missing players, scheduling conflicts, or resource constraints.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Voice Channel Mode
### `/voicechannels moveteam`
#### Description
 (Default: After All Setup) Sets when to move players to team voice channels.
#### Usage: `/voicechannels moveteam [when]`
#### Arguments:
`when`: *(Required)* When to move players to team channels.\
&emsp;&emsp;&emsp; Options: `After All Setup, After Teams Created`
>Moves queued players into their assigned team voice channels at a chosen trigger point—either once all match setup is complete or immediately when teams are created. Useful for automating the lobby-to-team transition and preventing premature relocations during setup; note that this action is restricted to users with administrative permissions.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/voicechannels permissions set`
#### Description
 Specify a permission to set for a role when creating voice channels.
#### Usage: `/voicechannels permissions set [role] [permission] [value]`
#### Arguments:
`role`: *(Required)* Role to modify permissions for.\
`permission`: *(Required)* Permission name.\
`value`: *(Required)* Permission value.\
&emsp;&emsp;&emsp; Options: `Deny, Allow, Default`
>Sets a permission overwrite for a role that will be applied to automatically created voice channels, controlling whether that role can perform actions such as connecting, speaking, or managing those channels. Restricted to administrators, this updates the permission template used during channel creation so subsequent auto-generated channels inherit the configured overwrite while existing channels remain unchanged and must be adjusted manually if needed.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/voicechannels teamchannels`
#### Description
 (Default: Enabled) Toggle creating separate voice channels for each team.
#### Usage: `/voicechannels teamchannels [toggle]`
#### Arguments:
`toggle`: *(Required)* If channels are created per team.\
&emsp;&emsp;&emsp; Options: `Enabled, Disabled`
>Enables or disables automatic creation of separate voice channels for each team, creating team-specific voice rooms when teams are formed and removing them when teams disband. Useful for organizing match lobbies or private team discussions to keep communications separated; note that this option requires administrative permissions and defaults to enabled, so disabling it will return teams to shared voice channels.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Voting Menu
### `/votingmenu add`
#### Description
 Add a new voting menu.
#### Usage: `/votingmenu add [title] [options] [key] [team_voting] (order) (button_colors) (show_numbers) (allow_random) (force_random) (number_of_votes)`
#### Arguments:
`title`: *(Required)* (Ex: Vote for the Region) The title for the vote.\
`options`: *(Required)* (Ex: NA,EU) Comma separated list of options. Ignored if options_variable exists with values.\
`key`: *(Required)* (Ex: Region Name) The key for this vote for displaying the result after.\
`team_voting`: *(Required)* Is the vote once per team, once for all teams, or for a specific team?.\
`order`: *(Optional)* (Ex: 1) The order for this vote in regard to other votes. Votes will occur in ascending order.\
`button_colors`: *(Optional)* (Ex: blurple,red) Comma separated list of button colors. Valid options: blurple, gray, green, red.\
`show_numbers`: *(Optional)* If each option should have a number associated with it when displayed.\
`allow_random`: *(Optional)* If a 'random' option is included in the vote.\
`force_random`: *(Optional)* If you want to skip the vote altogether and just pick a random option.\
`number_of_votes`: *(Optional)* Number of votes per player.
>Creates a configurable voting menu that presents a multi-option poll to users, supporting team-scoped or global voting, optional random selection, customizable button colors and numbering, and configurable vote counts per voter. Intended for admins to set up group decisions (map/region/mode selection, scheduling, etc.), votes are ordered relative to other menus, can source option lists externally and repeat as configured, and enforce eligibility while summarizing outcomes for display.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/votingmenu remove`
#### Description
 Remove the given voting menu.
#### Usage: `/votingmenu remove [title_and_order]`
#### Arguments:
`title_and_order`: *(Required)* Title and corresponding order of voting menu to delete.
>Removes the specified voting menu along with its associated messages and reactions, stopping any active voting and removing the menu from visible lists. Intended for administrators to clear completed, duplicate, or obsolete polls; note that this permanently deletes the menu and cancels ongoing votes, so confirm before executing.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

## Webhooks
>Webhooks receive information about a match as it is being setup.
> Each webhook will contain an "action" key in the payload.
> Currently supported actions are:
> - JOIN_QUEUE
> - LEAVE_QUEUE
> - MATCH_STARTED
> - TEAMS_CREATED
> - MATCH_COMPLETED
> - SUBSTITUTION
> 
> Additionally, if you have `/requireregister mode: Custom API`, you will receive a webhook with action
> - REGISTER_PLAYER
> 
> containing various information about the user, as well as the account they are attempting to register.
> You must either reply with a json object containing at least a "rating" key (ex: {"rating": 1000}), to specify the
> rating that the player should be registered with, or any non 200 status response to display to the user.
### `/webhooks add`
#### Description
 Add a new webhook to receive queue information.
#### Usage: `/webhooks add [url]`
#### Arguments:
`url`: *(Required)* Your webhook url.
>Registers a webhook URL to receive real-time queue information as POSTed JSON payloads whenever queue state changes, allowing external services to stay synchronized with queue activity. Intended for administrators to integrate monitoring dashboards, notification systems, or automation tools; ensure the endpoint is reachable and accepts POST requests (preferably HTTPS), as delivery failures will be reported and retried.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/webhooks delete`
#### Description
 Delete this queue's webhook.
#### Usage: `/webhooks delete`

>Removes the queue's configured webhook, immediately stopping the bot from sending webhook-based notifications to that endpoint. Use when rotating endpoints, decommissioning integrations, or troubleshooting delivery issues; note that the action is immediate, requires administrator privileges, and will prevent any further webhook deliveries until a new webhook is configured.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

---

### `/webhooks generatetoken`
#### Description
 Generate an API token for your account.
#### Usage: `/webhooks generatetoken`

>Generates a secure, one-time-view API token for administrators by creating a unique, non-guessable credential tied to the requesting account and returning it immediately for secure copying. Commonly used to authenticate integrations, CLI tools, or external services; note the token is shown only at creation and must be stored externally, and it can be revoked or regenerated by an administrator if needed.
#### Usage Permissions: `Staff Role or Manage Channels Permission`

<hr style="border:3px solid gray">

# API
### Base URL: `https://api.neatqueue.com/`
### [Generate an API token](/#/?id=webhooks-generatetoken)
### [View Endpoints](https://api.neatqueue.com/docs)

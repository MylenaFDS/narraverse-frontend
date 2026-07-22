import type { CampaignState } from "../state/CampaignState"
import type { StoryContext } from "../../writer/story/types/StoryContext"

export class StoryContextAdapter {


static toStoryContext(
 state: CampaignState,
): StoryContext {


return {


recentTurns: [],


lastActions:
state.history
.filter(
event =>
event.type === "attack"
||
event.type === "movement"
)
.map(
event =>
event.description
),


lastDialogues:
state.history
.filter(
event =>
event.type === "dialogue"
)
.map(
event =>
event.description
),


activeEvents:
state.activeEvents,


unresolvedThreads:
[],


currentSituation:
state.activeEvents.join(
". "
),


recentFacts:
state.history.map(
event =>
event.description
),


mentionedCharacters:
[
...state.aliveCharacters,
...state.deadCharacters,
],


topics:
state.activeEvents,


sceneMood:
"unknown",


unansweredQuestions: [],


}

}

}
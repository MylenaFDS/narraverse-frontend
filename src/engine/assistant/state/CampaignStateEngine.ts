import type {
  CampaignState,
} from "./CampaignState"


import type {
  StoryEvent,
} from "./events/StoryEvent"



export class CampaignStateEngine {



static update(

  state: CampaignState,

  events: StoryEvent[],

): CampaignState {



const next:CampaignState = {


...state,


turn:
state.turn + 1,



history:[
...state.history,
],



activeEvents:[
...state.activeEvents,
],



aliveCharacters:[
...state.aliveCharacters,
],



deadCharacters:[
...state.deadCharacters,
],



knownCharacters:[
...state.knownCharacters,
],



knownLocations:[
...state.knownLocations,
],



discoveredLocations:[
...state.discoveredLocations,
],



activeQuests:[
...state.activeQuests,
],



completedQuests:[
...state.completedQuests,
],



activeObjectives:[
...state.activeObjectives,
],



recentDialogues:[
...state.recentDialogues,
],



recentActions:[
...state.recentActions,
],



recentFacts:[
...state.recentFacts,
],



unresolvedThreads:[
...state.unresolvedThreads,
],



relationships:[
...(state.relationships ?? []),
],



reputation:
{
...(state.reputation ?? {}),
},



}







for(
const event of events
){



// =============================
// Memória principal
// =============================


next.history.push(
event,
)





// =============================
// Personagens conhecidos
// =============================


this.registerCharacter(
next,
event.actorName,
)


this.registerCharacter(
next,
event.targetName,
)






// =============================
// Localização
// =============================


if(
event.location
){

this.registerLocation(
next,
event.location,
)

}







// =============================
// Processamento narrativo
// =============================


switch(
event.type
){





// =================================
// COMBATE
// =================================


case "attack":


this.addActiveEvent(

next,

event.description,

)


this.rememberAction(
next,
event,
)


break







case "defense":


this.rememberAction(
next,
event,
)


break







// =================================
// MOVIMENTO
// =================================


case "movement":


this.addActiveEvent(

next,

event.description,

)


this.rememberAction(
next,
event,
)


break







// =================================
// DIÁLOGO
// =================================


case "dialogue":


next.recentDialogues.push(

event.sourceText ??
event.description,

)


break







// =================================
// MORTE
// =================================


case "death":


this.processDeath(
next,
event,
)


break







// =================================
// RELACIONAMENTO
// =================================


case "relationship":


this.processRelationship(
next,
event,
)


break







// =================================
// ALIANÇA
// =================================


case "alliance":


this.processAlliance(
next,
event,
)


break







// =================================
// CONFLITO
// =================================


case "conflict":


this.processConflict(
next,
event,
)


break







// =================================
// PROFECIA / LORE
// =================================


case "prophecy":


next.unresolvedThreads.push(

event.description,

)


next.recentFacts.push(

event.sourceText ??
event.description,

)


break







// =================================
// QUEST
// =================================


case "quest":


if(
!next.activeQuests.includes(
event.description,
)
){

next.activeQuests.push(
event.description,
)

}


break







case "discovery":


next.recentFacts.push(

event.description,

)


break




}


}







// =============================
// Limpeza de memória
// =============================


next.history =
next.history.slice(-100)



next.recentActions =
next.recentActions.slice(-15)



next.recentDialogues =
next.recentDialogues.slice(-15)



next.recentFacts =
next.recentFacts.slice(-30)



next.unresolvedThreads =
[
...new Set(
next.unresolvedThreads,
)
]




next.activeEvents =
[
...new Set(
next.activeEvents,
)
]




return next


}









// =================================================
// MORTE REAL
// =================================================


private static processDeath(

state:CampaignState,

event:StoryEvent,

){



const name =
event.targetName ??
event.actorName



if(
!name
)return




state.aliveCharacters =
state.aliveCharacters.filter(

c =>
c !== name

)



if(
!state.deadCharacters.includes(
name,
)
){

state.deadCharacters.push(
name,
)

}



state.recentFacts.push(

`${name} morreu`,

)



}









// =================================================
// RELACIONAMENTOS
// =================================================


private static processRelationship(

state:CampaignState,

event:StoryEvent,

){



if(
!event.actorName &&
!event.targetName
)
return



state.relationships.push({

from:
event.actorName ?? "Desconhecido",


to:
event.targetName ?? "Desconhecido",


type:
"personal",


turn:
state.turn,


})





state.recentFacts.push(

event.description,

)



}









// =================================================
// ALIANÇA
// =================================================


private static processAlliance(

state:CampaignState,

event:StoryEvent,

){


state.relationships.push({

from:
event.actorName ?? "Desconhecido",


to:
event.targetName ?? "Grupo",


type:
"alliance",


turn:
state.turn,

})



state.recentFacts.push(

event.description,

)



}









// =================================================
// CONFLITO
// =================================================


private static processConflict(

state:CampaignState,

event:StoryEvent,

){



state.activeEvents.push(

event.description,

)



state.unresolvedThreads.push(

event.description,

)



}









// =================================================
// REPUTAÇÃO
// =================================================


private static processReputation(

state:CampaignState,

name:string,

value:number,

){


if(
!state.reputation[name]
){

state.reputation[name]=0

}



state.reputation[name]+=value



}









// =================================================
// MEMÓRIA
// =================================================


private static rememberAction(

state:CampaignState,

event:StoryEvent,

){


state.recentActions.push(

event.sourceText ??
event.description,

)



}









// =================================================
// PERSONAGEM
// =================================================


private static registerCharacter(

state:CampaignState,

name?:string,

){


if(
!name
)
return



if(
!state.knownCharacters.includes(
name,
)
){

state.knownCharacters.push(
name,
)

}



}









// =================================================
// LOCAL
// =================================================


private static registerLocation(

state:CampaignState,

location:string,

){


if(
!state.knownLocations.includes(
location,
)
){

state.knownLocations.push(
location,
)

}



if(
!state.discoveredLocations.includes(
location,
)
){

state.discoveredLocations.push(
location,
)

}


}









private static addActiveEvent(

state:CampaignState,

event:string,

){


if(
!state.activeEvents.includes(
event,
)
){

state.activeEvents.push(
event,
)

}



}



}
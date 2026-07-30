import type {
RPGTurn,
} from "../../../../../types/turn"


import type {
StoryEvent,
} from "../StoryEvent"



export class RelationshipInterpreter {



static interpret(
turn:RPGTurn,
):StoryEvent[]{



const text =
turn.content.toLowerCase()


const events:StoryEvent[]=[]


const actorId =
turn.character_id ?? undefined



const targetName =
this.extractMention(
turn.content,
)





if(
this.contains(
text,
[
"cas",
"amor",
"abraç",
"beij",
"espos",
"namor",
"união",
"relacion",
]
)
){



events.push({

type:"relationship",

actorId,


targetName,


description:
"Uma relação pessoal evoluiu",


sourceText:
turn.content,


turnId:
turn.id,


})

}





if(
this.contains(
text,
[
"alian",
"pacto",
"juramento",
"juntos",
"leald",
"prometo",
]
)
){


events.push({

type:"alliance",

actorId,

targetName,


description:
"Uma aliança foi fortalecida",


sourceText:
turn.content,


turnId:
turn.id,

})


}





if(
this.contains(
text,
[
"trai",
"engan",
"conspir",
"vingança",
]
)
){


events.push({

type:"conflict",

actorId,

targetName,


description:
"Uma traição criou conflito",


sourceText:
turn.content,


turnId:
turn.id,

})


}



return events


}





private static contains(
text:string,
words:string[],
){


return words.some(
word =>
text.includes(word)
)


}





private static extractMention(
text:string,
){


const match =
text.match(
/@([A-Za-zÀ-ÿ]+)/,
)


return match
?
match[1]
:
undefined


}


}
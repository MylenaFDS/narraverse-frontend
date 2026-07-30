import type {
 RPGTurn,
} from "../../../../../types/turn"


import type {
 StoryEvent,
} from "../StoryEvent"



export class DeathInterpreter {


static interpret(
 turn:RPGTurn,
):StoryEvent[]{


const text =
 turn.content.toLowerCase()



const events:StoryEvent[]=[]



const deathWords=[

 "morreu",
 "morte",
 "faleci",
 "faleceu",
 "assassinado",
 "assassinada",
 "matou",
 "mataram",
 "eliminado",
 "eliminada",
 "sacrificou",
 "sacrifiquei",
 "pereceu",
 "caído",
 "caida",

]



if(
 deathWords.some(
 word =>
 text.includes(word)
 )
){


const target =
 this.extractTarget(
 turn.content,
)



events.push({

type:"death",


actorId:
 turn.character_id ?? undefined,


targetName:
 target,


description:
 `${target ?? "Um personagem"} morreu`,


sourceText:
 turn.content,


turnId:
 turn.id,


})

}



return events


}





private static extractTarget(
text:string,
){


const mention =
text.match(
/@([A-Za-zÀ-ÿ]+)/,
)



if(
mention
){
return mention[1]
}



const words =
text.split(" ")



return words[0]


}



}
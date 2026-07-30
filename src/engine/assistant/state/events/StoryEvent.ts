import type {
 EventType,
} from "./EventType"



export interface StoryEvent {


type:EventType



actorId?:number

actorName?:string



targetId?:number

targetName?:string



location?:string



emotion?:string



description:string



sourceText?:string



turnId?:number



}
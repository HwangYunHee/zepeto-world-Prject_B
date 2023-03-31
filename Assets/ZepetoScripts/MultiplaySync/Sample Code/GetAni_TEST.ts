import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {Collider, Object, Coroutine} from 'UnityEngine'
import * as UnityEngine from "UnityEngine";
import {ZepetoPlayer, ZepetoPlayers} from 'ZEPETO.Character.Controller';
import PlayerSync from '../Player/PlayerSync';

export default class GestureTrigger extends ZepetoScriptBehaviour {
    //A script that plays gestures when a Zepeto character is triggered.


@SerializeField() private m_exGestures: UnityEngine.AnimationClip;

//   @SerializeField() private m_exGestures: UnityEngine.AnimationClip[] = [];
//    private m_gestureCoroutine:Coroutine;

    //Gesture testcode
    private OnTriggerEnter(coll: Collider) {
        if(!coll.GetComponent<PlayerSync>()?.isLocal)
            return;
         coll.GetComponent<PlayerSync>().zepetoPlayer.character.SetGesture(this.m_exGestures);
    }


}
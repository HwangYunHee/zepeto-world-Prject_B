         


import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { Button } from 'UnityEngine.UI';
import { CharacterState, ZepetoCharacter, ZepetoPlayers } from 'ZEPETO.Character.Controller';

export default class JumpButton extends ZepetoScriptBehaviour {

    public shotButton: Button;
    private zepetoCharacter: ZepetoCharacter;

    Start() {
        // Create character
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            this.zepetoCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
        });
        // Add script component
        this.shotButton.onClick.AddListener(() => {
            if (this.zepetoCharacter.CurrentState === CharacterState.Jump) {
                this.zepetoCharacter.DoubleJump();
            } else {
                this.zepetoCharacter.Jump();
            }
        });
    }
}
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class CharacterService {
    private characterSavedSource = new Subject<any>();
    private characterImageUpdatedSource = new Subject<{ id: number, imageUrl: string }>();

    characterImageUpdated$ = this.characterImageUpdatedSource.asObservable();

    characterSaved$ = this.characterSavedSource.asObservable();

    saveCharacter(characterData: any) {
        this.characterSavedSource.next(characterData);
    }

    updateCharacterImage(id: number, imageUrl: string) {
        this.characterImageUpdatedSource.next({ id, imageUrl });
    }
}
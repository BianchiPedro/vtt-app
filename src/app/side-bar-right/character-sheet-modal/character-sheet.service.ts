import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class CharacterService {
    private characterSavedSource = new Subject<any>();

    characterSaved$ = this.characterSavedSource.asObservable();

    saveCharacter(characterData: any) {
        this.characterSavedSource.next(characterData);
    }
}
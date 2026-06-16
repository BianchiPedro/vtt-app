import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class CharacterService {
    private characterSavedSource = new Subject<any>();
    private characterImageUpdatedSource = new Subject<{ id: number, imageUrl: string }>();
    private characterVault: any[] = [];

    characterImageUpdated$ = this.characterImageUpdatedSource.asObservable();
    characterSaved$ = this.characterSavedSource.asObservable();

    saveCharacter(characterData: any) {
        const index = this.characterVault.findIndex(c => c.id === characterData.id);

        if (index > -1) {
        this.characterVault[index] = characterData;
        } else {
        this.characterVault.push(characterData);
        }
        
        this.characterSavedSource.next(characterData);
        }

    updateCharacterImage(id: number, imageUrl: string) {
        this.characterImageUpdatedSource.next({ id, imageUrl });
    }

    getCharacterById(id: number): any {
    return this.characterVault.find(c => c.id === id);
  }
}
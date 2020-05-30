import { Injectable } from '@angular/core';
import { Note } from './note.module';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  notes: Note[] = new Array<Note>();
  constructor() { }

  getAll(){
    return this.notes;
  }

  get(id:number){
    return this.notes[id];
  }

  getId(note: Note){
    return this.notes.indexOf(note);
  }

  add(note:Note){
    // Add a note to notes and return the index which is ID
    let newLength = this.notes.push(note);
    return newLength-1;
  }
  update(id: number, title: string, body: string){
    let note = this.notes[id];
    note.title = title;
    note.body = body;
  }

  delete(id: number){
    this.notes.splice(id,1);
  }
}

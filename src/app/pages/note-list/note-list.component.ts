import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Note } from 'src/app/shared/note.module';
import { NotesService } from 'src/app/shared/notes.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss'],
  animations: [
    trigger('itemAnim',[
      // ENTRY Animation
      transition('void => *',[
      // et the initial state
      style({
        height:0,
        opacity:0,
        transform:'scale(0.85)',
        'margin-bottom':0,
        // need expansion for firefox and safari bugs
        paddingTop:0,
        paddingBottom:0,
        paddingRight:0,
        paddingLeft:0,
        }),
      // Animate the spacing as in height and margin
      animate('50ms', style({
        height:'*',
        'margin-bottom':'*',
        // need expansion for firefox and safari bugs
        paddingTop:'*',
        paddingBottom:'*',
        paddingRight:'*',
        paddingLeft:'*',

      })),
      animate(100)
      ]),
      transition('*=>void',[
        // to disappear by scaleup
        animate(50, style({
          transform: 'scale(1.05)'
        })),
        // then scale down back to to normal size and fade out
        animate(50, style({
          transform: 'scale(1)',
        })),
        // scale down and fade out completely
        animate('120ms ease-out', style({
          transform:'scale(0.68)',
          opacity:0
        })),
        // animate the spacing as in height, padding and margin
        animate('120ms ease-out', style({
          height:0,
          opacity:0,
          transform:'scale(0.85)',
          'margin-bottom':0,
          // need expansion for firefox and safari bugs
          paddingTop:0,
          paddingBottom:0,
          paddingRight:0,
          paddingLeft:0,
        }))
      ])
    ]),
    trigger('listAnim', [
      transition('*=>*', [
        query(':enter', [style({
          opacity:0,
          height:0
          }),
          stagger(100, [
            animate('0.2s ease')
          ])
        ],{optional: true})
      ])
    ])
  ]
})
export class NoteListComponent implements OnInit {

  notes: Note[] = new Array<Note>();
  filteredNotes: Note[] = new Array<Note>();
  
  @ViewChild('filterInput') filterInputElementRef: ElementRef<HTMLInputElement>;
  constructor(private noteService:NotesService) { }

  ngOnInit(): void {
    this.notes = this.noteService.getAll();
    //this.filteredNotes = this.noteService.getAll();
    this.filter('');
  }

  deleteNote(note: Note){
    let noteId = this.noteService.getId(note);
    this.noteService.delete(noteId);
    this.filter(this.filterInputElementRef.nativeElement.value);
  }

  removeDuplicate(arr: Array<any>) : Array<any>{

    let uniqueResults:Set<any>= new Set<any>();
    arr.forEach(element => {
      uniqueResults.add(element);
    });
    return Array.from(uniqueResults);
  }

  filter(query: string){
    query = query.toLocaleLowerCase().trim();

    // split the search query
    let terms: string[] = query.split(' ');
    let allResults: Note[] = new Array<Note>();
    terms = this.removeDuplicate(terms);
    // compile the relevant results and add them to allresults array
    terms.forEach(term => {
      let results:Note[]= this.relevantNotes(term);
      // Append results to the allResults array
      allResults = [...allResults, ...results];
    });
    // Because a note can appear by multiple terms
    let uniqueResults = this.removeDuplicate(allResults);
    this.filteredNotes = uniqueResults;
    this.sortByRelevacy(allResults);
  }
  relevantNotes(query:string): Array<Note>{
    query = query.toLocaleLowerCase().trim();
    let relevantNotes = this.notes.filter(note => {
      if(note.title && 
        note.title.toLocaleLowerCase().includes(query))
      {return true;
      }

      if(note.body && 
        note.body.toLocaleLowerCase().includes(query)){
        return true;
      }
      else {return false;}
    })
    return relevantNotes;
  }
  sortByRelevacy(searchResults: Array<Note>){
    // This method calculates the relevancy of a note based on
    // number of times it appears in search results

    // format - key:value =>
    // noteId:number (noteObjectId : count of frequency in search results)
    let noteCountObj: Object={}; 
    searchResults.forEach(note => {
      let noteId = this.noteService.getId(note);
      if(noteCountObj[noteId]){
        ++noteCountObj[noteId];
      }else {
        noteCountObj[noteId] = 1;
      }
    });
    this.filteredNotes = this.filteredNotes.sort((a:Note, b:Note)=> {
      let aId = this.noteService.getId(a);
      let bId = this.noteService.getId(b);
      
      let aCount = noteCountObj[aId];
      let bCount = noteCountObj[bId];

      return bCount - aCount;
    });
  }
  generateNoteURL(note:Note){
    let noteId = this.noteService.getId(note);
    return noteId;
  }
}

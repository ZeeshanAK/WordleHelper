import { Component, ViewChild, ElementRef, Inject } from '@angular/core';
import { Letters } from './Letter';
import { HttpClient } from '@angular/common/http';
import { Notyf } from 'notyf';
import { NOTYF } from './notyf.token';
import { environment } from 'src/environments/environment';

interface WordRow {
  letters: Letters[];
  submitted: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private http: HttpClient, @Inject(NOTYF) private notyf: Notyf) {}
  
  // Wordle uses 5-letter words and 6 guesses
  readonly WORD_LENGTH = 5;
  readonly MAX_ROWS = 6;
  
  // Official Wordle word lists (subset for demonstration - in production, use full lists)
  // These are common Wordle answers and valid guesses
  private wordleAnswers: string[] = [
    'cigar', 'rebut', 'sissy', 'humph', 'awake', 'blush', 'focal', 'evade', 'naval', 'serve',
    'heath', 'dwarf', 'model', 'karma', 'stink', 'grade', 'quiet', 'bench', 'abate', 'feign',
    'major', 'death', 'fresh', 'crust', 'stool', 'colon', 'abase', 'marry', 'react', 'batty',
    'pride', 'floss', 'helix', 'croak', 'staff', 'paper', 'unfed', 'whelp', 'trawl', 'outdo',
    'adobe', 'crazy', 'sower', 'repay', 'digit', 'crate', 'cluck', 'spike', 'mimic', 'pound',
    'maxim', 'linen', 'unmet', 'flesh', 'booby', 'forth', 'first', 'stand', 'belly', 'ivory',
    'seedy', 'print', 'yearn', 'drain', 'bribe', 'stout', 'panel', 'crass', 'flume', 'offal',
    'agree', 'error', 'swirl', 'argue', 'bleed', 'delta', 'flick', 'totem', 'wooer', 'front',
    'shrub', 'parry', 'biome', 'lapel', 'start', 'greet', 'goner', 'goody', 'frown', 'jovial',
    'royal', 'viral', 'tense', 'plank', 'crape', 'crowd', 'whack', 'mount', 'perky', 'could',
    'wrung', 'light', 'those', 'moist', 'shard', 'pleat', 'aloft', 'skill', 'elder', 'frame',
    'humor', 'pause', 'ulcer', 'ultra', 'robin', 'cynic', 'aroma', 'caulk', 'shake', 'pupal',
    'dodge', 'swill', 'tacit', 'other', 'thorn', 'trove', 'bloke', 'vivid', 'spill', 'chant',
    'choke', 'rupee', 'nasty', 'mourn', 'ahead', 'brine', 'cloth', 'hoard', 'sweet', 'month',
    'lapse', 'watch', 'today', 'focus', 'smelt', 'tease', 'cater', 'movie', 'saute', 'allow',
    'renew', 'their', 'slosh', 'purge', 'chest', 'depot', 'epoxy', 'nymph', 'found', 'shall',
    'harry', 'stove', 'lowly', 'snout', 'trope', 'fewer', 'shawl', 'natal', 'comma', 'foray',
    'scare', 'stair', 'black', 'squad', 'royal', 'chunk', 'mince', 'shame', 'cheek', 'ample',
    'flair', 'foyer', 'cargo', 'oxide', 'plant', 'olive', 'inert', 'askew', 'heist', 'shown',
    'zesty', 'trash', 'larva', 'forgo', 'story', 'hairy', 'train', 'homer', 'badge', 'midst',
    'canny', 'shine', 'gecko', 'farce', 'slung', 'tipsy', 'metal', 'yield', 'delve', 'being',
    'scour', 'glass', 'gamer', 'scrap', 'money', 'hinge', 'album', 'vouch', 'asset', 'tiara',
    'crept', 'bayou', 'atoll', 'manor', 'creak', 'showy', 'phase', 'froth', 'depth', 'gloom',
    'flood', 'trait', 'girth', 'piety', 'goose', 'float', 'donor', 'atone', 'primo', 'apron',
    'blown', 'cacao', 'loser', 'input', 'gloat', 'awful', 'brink', 'smite', 'beady', 'rusty',
    'retro', 'droll', 'gawky', 'hutch', 'pinto', 'egret', 'lilac', 'sever', 'field', 'fluff',
    'agape', 'voice', 'stead', 'berth', 'madam', 'night', 'bland', 'liver', 'wedge', 'roomy',
    'wacky', 'flock', 'angry', 'trite', 'aphid', 'tryst', 'midge', 'power', 'elope', 'cinch',
    'motto', 'stomp', 'upset', 'bluff', 'cramp', 'quart', 'coyly', 'youth', 'rhyme', 'buggy',
    'alien', 'smear', 'unfit', 'patty', 'cling', 'glean', 'label', 'hunky', 'khaki', 'poker',
    'gruel', 'twice', 'twang', 'shrug', 'treat', 'waste', 'merit', 'woven', 'needy', 'clump',
    'sonic', 'cashy', 'theme', 'downy', 'knead', 'quirk', 'rapid', 'bugle', 'deity',
    'tepid', 'arise', 'tutor', 'abode', 'corps', 'swath', 'crash', 'groan', 'aisle',
    'bacon', 'array', 'paler', 'aorta', 'adult', 'judge', 'rower', 'artsy', 'rural', 'shave'
  ];

  ngOnInit(): void {
    // Try to load extended word list from external source for more suggestions
    this.http
      .get(
        'https://raw.githubusercontent.com/ZeeshanAK/english-words/master/words_alpha.txt',
        { responseType: 'text' as 'json' }
      )
      .subscribe({
        next: (data) => {
          const allWords = (<string>data).split(/\r?\n/);
          // Filter to only 5-letter words and combine with Wordle answers
          const fiveLetterWords = allWords.filter(word => word.length === this.WORD_LENGTH && /^[a-z]+$/.test(word));
          // Combine and deduplicate
          this.filteredWordsOrignal = [...new Set([...this.wordleAnswers, ...fiveLetterWords])].sort();
        },
        error: (err) => {
          console.warn('Could not fetch extended word list, using built-in list');
          this.filteredWordsOrignal = [...this.wordleAnswers].sort();
        }
      });
    
    // Initialize empty rows
    this.initializeRows();
  }
  
  title = 'WordleHelper';
  filteredWordsOrignal: string[] = [];
  filteredWords: string[] = [];

  rows: WordRow[] = [];
  colors = ['dark', 'yellow', 'green'];
  isLoading = true;
  
  initializeRows(): void {
    this.rows = [];
    for (let i = 0; i < this.MAX_ROWS; i++) {
      this.rows.push({
        letters: Array(this.WORD_LENGTH).fill(null).map(() => new Letters('', 'dark')),
        submitted: false
      });
    }
  }
  
  get currentRow(): WordRow | null {
    const row = this.rows.find(r => !r.submitted);
    return row || null;
  }
  
  get currentRowIndex(): number {
    return this.rows.findIndex(r => !r.submitted);
  }

  onKeyPress(event: KeyboardEvent, rowIndex: number, letterIndex: number): void {
    const key = event.key.toLowerCase();
    
    // Handle backspace
    if (event.key === 'Backspace') {
      if (letterIndex > 0 && this.rows[rowIndex].letters[letterIndex].letter === '') {
        this.rows[rowIndex].letters[letterIndex - 1].letter = '';
        // Move focus to previous box
        const prevInput = document.getElementById(`letter-${rowIndex}-${letterIndex - 1}`);
        if (prevInput) {
          prevInput.focus();
        }
      } else {
        this.rows[rowIndex].letters[letterIndex].letter = '';
      }
      event.preventDefault();
      return;
    }
    
    // Handle Enter - submit the word
    if (event.key === 'Enter') {
      this.submitRow(rowIndex);
      event.preventDefault();
      return;
    }
    
    // Only allow single alphabetic characters
    if (!/^[a-z]$/.test(key)) {
      return;
    }
    
    // Add the letter
    this.rows[rowIndex].letters[letterIndex].letter = key;
    
    // Prevent default to stop the character from being inserted again
    event.preventDefault();
    
    // Move to next box if not last
    if (letterIndex < this.WORD_LENGTH - 1) {
      const nextInput = document.getElementById(`letter-${rowIndex}-${letterIndex + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  }
  
  submitRow(rowIndex: number): void {
    const row = this.rows[rowIndex];
    const word = row.letters.map(l => l.letter).join('');
    
    // Validate word length
    if (word.length !== this.WORD_LENGTH) {
      this.notyf.error(`Please enter a ${this.WORD_LENGTH}-letter word`);
      return;
    }
    
    // Mark row as submitted
    row.submitted = true;
    
    // Filter words based on all submitted rows
    this.filterWords();
    
    // Focus on next row's first input if available
    if (rowIndex < this.MAX_ROWS - 1) {
      setTimeout(() => {
        const nextInput = document.getElementById(`letter-${rowIndex + 1}-0`);
        if (nextInput) {
          nextInput.focus();
        }
      }, 100);
    }
  }
  
  clearRow(rowIndex: number): void {
    this.rows[rowIndex].letters.forEach(l => l.letter = '');
    this.rows[rowIndex].submitted = false;
    this.filterWords();
    
    // Focus on first input of cleared row
    setTimeout(() => {
      const firstInput = document.getElementById(`letter-${rowIndex}-0`);
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);
  }

  changeColor(el: any, rowIndex: number, letterIndex: number): void {
    if (this.filteredWordsOrignal.length == 0) {
      this.notyf.error(
        'Cannot fetch words right now. Please check back in a while. Thanks!'
      );
      return;
    }

    let color = this.rows[rowIndex].letters[letterIndex].color;

    switch (color) {
      case 'dark':
        this.rows[rowIndex].letters[letterIndex].color = 'green';
        el.currentTarget.classList.add('mat-chip-green');
        el.currentTarget.classList.remove('mat-chip-dark');
        break;
      case 'green':
        this.rows[rowIndex].letters[letterIndex].color = 'yellow';
        el.currentTarget.classList.add('mat-chip-yellow');
        el.currentTarget.classList.remove('mat-chip-green');
        break;
      case 'yellow':
        this.rows[rowIndex].letters[letterIndex].color = 'dark';
        el.currentTarget.classList.add('mat-chip-dark');
        el.currentTarget.classList.remove('mat-chip-yellow');
        break;
    }
    
    this.filterWords();
  }

  filterWords(): void {
    // Start with all words of the correct length
    this.filteredWords = [...this.filteredWordsOrignal];

    // Collect all constraints from all submitted rows
    const greenConstraints: { letter: string; position: number }[] = [];
    const yellowConstraints: { letter: string; position: number }[] = [];
    const darkConstraints: string[] = [];
    const greenYellowLetters: Set<string> = new Set();

    // Gather all constraints from submitted rows
    this.rows.forEach(row => {
      if (!row.submitted) return;
      
      row.letters.forEach((letterObj, position) => {
        if (letterObj.letter === '') return;
        
        if (letterObj.color === 'green') {
          greenConstraints.push({ letter: letterObj.letter, position });
          greenYellowLetters.add(letterObj.letter);
        } else if (letterObj.color === 'yellow') {
          yellowConstraints.push({ letter: letterObj.letter, position });
          greenYellowLetters.add(letterObj.letter);
        } else if (letterObj.color === 'dark') {
          // Only add to dark constraints if not marked green/yellow elsewhere
          if (!greenYellowLetters.has(letterObj.letter)) {
            darkConstraints.push(letterObj.letter);
          }
        }
      });
    });

    // Filter 1: Green letters - must be at exact position
    greenConstraints.forEach(constraint => {
      this.filteredWords = this.filteredWords.filter(
        (word) => word[constraint.position] === constraint.letter
      );
    });

    // Filter 2: Yellow letters - must exist in word but NOT at the marked position
    yellowConstraints.forEach(constraint => {
      this.filteredWords = this.filteredWords.filter(
        (word) => 
          word.includes(constraint.letter) && 
          word[constraint.position] !== constraint.letter
      );
    });

    // Filter 3: Dark letters - should not exist in word (if not also green/yellow)
    const uniqueDarkLetters = [...new Set(darkConstraints)];
    uniqueDarkLetters.forEach(letter => {
      this.filteredWords = this.filteredWords.filter(
        (word) => !word.includes(letter)
      );
    });
  }
}

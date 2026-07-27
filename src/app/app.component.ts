import { Component, ViewChild, ElementRef, Inject } from '@angular/core';
import { Letters } from './Letter';
import { HttpClient } from '@angular/common/http';
import { Notyf } from 'notyf';
import { NOTYF } from './notyf.token';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private http: HttpClient, @Inject(NOTYF) private notyf: Notyf) {}
  
  // Wordle uses 5-letter words
  readonly WORD_LENGTH = 5;
  
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
  }
  
  title = 'WordleHelper';
  filteredWordsOrignal: string[] = [];
  filteredWords: string[] = [];

  letters: Letters[] = [];
  letter: string = '';
  colors = ['dark', 'yellow', 'green'];
  isLoading = true;

  CreateLetters(el: any): void {
    this.letters = [];
    [...this.letter.toLowerCase()].forEach((element) => {
      // Only allow alphabetic characters
      if (/[a-z]/.test(element)) {
        this.letters.push(new Letters(element, 'dark'));
      }
    });
    // Reset filtered words when input changes
    this.filteredWords = this.filteredWordsOrignal;
  }

  changeColor(el: any, index: number): void {
    if (this.filteredWordsOrignal.length == 0) {
      this.notyf.error(
        'Cannot fetch words right now. Please check back in a while. Thanks!'
      );
      return;
    }

    let color = this.letters[index].color;

    switch (color) {
      case 'dark':
        this.letters[index].color = 'green';
        el.currentTarget.classList.add('mat-chip-green');
        el.currentTarget.classList.remove('mat-chip-dark');
        break;
      case 'green':
        this.letters[index].color = 'yellow';
        el.currentTarget.classList.add('mat-chip-yellow');
        el.currentTarget.classList.remove('mat-chip-green');
        break;
      case 'yellow':
        this.letters[index].color = 'dark';
        el.currentTarget.classList.add('mat-chip-dark');
        el.currentTarget.classList.remove('mat-chip-yellow');
        break;
    }
    
    this.filterWords();
  }

  filterWords(): void {
    // Start with all words of the correct length
    this.filteredWords = this.filteredWordsOrignal.filter(
      (word) => word.length === this.letter.length
    );

    // Separate letters by color
    const greenLetters = this.letters.filter(l => l.color === 'green');
    const yellowLetters = this.letters.filter(l => l.color === 'yellow');
    const darkLetters = this.letters.filter(l => l.color === 'dark');

    // Filter 1: Green letters - must be at exact position
    this.letters.forEach((letterObj, position) => {
      if (letterObj.color === 'green') {
        this.filteredWords = this.filteredWords.filter(
          (word) => word[position] === letterObj.letter
        );
      }
    });

    // Filter 2: Yellow letters - must exist in word but NOT at the marked position
    this.letters.forEach((letterObj, position) => {
      if (letterObj.color === 'yellow') {
        this.filteredWords = this.filteredWords.filter(
          (word) => 
            word.includes(letterObj.letter) && 
            word[position] !== letterObj.letter
        );
      }
    });

    // Filter 3: Dark letters - should not exist in word UNLESS they are also marked green/yellow elsewhere
    this.letters.forEach((letterObj, position) => {
      if (letterObj.color === 'dark') {
        const isAlsoGreenOrYellow = this.letters.some(
          (l, i) => l.letter === letterObj.letter && l.color !== 'dark' && i !== position
        );
        
        if (!isAlsoGreenOrYellow) {
          // Letter is not in the word at all
          this.filteredWords = this.filteredWords.filter(
            (word) => !word.includes(letterObj.letter)
          );
        } else {
          // Letter exists elsewhere as green/yellow, just exclude this position
          this.filteredWords = this.filteredWords.filter(
            (word) => word[position] !== letterObj.letter
          );
        }
      }
    });
  }
}

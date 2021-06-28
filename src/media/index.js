import {default as monster1Image} from './monster1.png'
import {default as monster2Image} from './monster2.png'
import {default as monster3Image} from './monster3.png'
import {default as monster4Image} from './monster4.png'
import {default as monster5Image} from './monster5.png'
import {default as monster6Image} from './monster6.png'
import {default as monster7Image} from './monster7.png'
import {default as monster8Image} from './monster8.png'
import {default as monster9Image} from './monster9.png'
import {default as monster10Image} from './monster10.png'
import {default as monster11Image} from './monster1.png'


export const getImage = (monsterID) => {
    switch(monsterID){
        case 1: return monster1Image;
        case 2: return monster2Image;
        case 3: return monster3Image;
        case 4: return monster4Image;
        case 5: return monster5Image;
        case 6: return monster6Image;
        case 7: return monster7Image;
        case 8: return monster8Image;
        case 9: return monster9Image;
        case 10: return monster10Image;
        case 11: return monster11Image;
    }
}


export const getName = (monsterID) => {
    switch(monsterID){
        case 1: return "Birdy Boss";
        case 2: return "Casper Spray";
        case 3: return "Hit Woman";
        case 4: return "Aqua Coach";
        case 5: return "Thunder Kid";
        case 6: return "Mad Sauce";
        case 7: return "Octo Crush";
        case 8: return "Shady Stick";
        case 9: return "Sawft Ball";
        case 10: return "Hippie Puns";
        case 11: return "King Cyborg";
    }
}
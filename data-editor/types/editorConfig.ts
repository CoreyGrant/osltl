// {
//     skills: {[key: string]: number};
//     quests: string[];
//     diary: string[];
//     kourend: {[key: string]: number};
//     areas: (string|string[])[];
// }[];
const questNames = [
    "Cook's Assistant",
    "Demon Slayer",
    "Restless Ghost",
    "Romeo & Juliet",
    "Sheep Shearer",
    "Shield of Arrav",
    "Ernest the Chicken",
    "Vampyre Slayer",
    "Imp Catcher",
    "Prince Ali Rescue",
    "Doric's Quest",
    "Black Knights' Fortress",
    "Witch's Potion",
    "Knight's Sword",
    "Goblin Diplomacy",
    "Pirate's Treasure",
    "Dragon Slayer I",
    "Rune Mysteries",
    "Misthalin Mystery",
    "Corsair Curse",
    "X Marks the Spot",
    "Below Ice Mountain",
    "Druidic Ritual",
    "Lost City",
    "Witch's House",
    "Merlin's Crystal",
    "Heroes' Quest",
    "Scorpion Catcher",
    "Family Crest",
    "Tribal Totem",
    "Fishing Contest",
    "Monk's Friend",
    "Temple of Ikov",
    "Clock Tower",
    "Holy Grail",
    "Tree Gnome Village",
    "Fight Arena",
    "Hazeel Cult",
    "Sheep Herder",
    "Plague City",
    "Sea Slug",
    "Waterfall Quest",
    "Biohazard",
    "Jungle Potion",
    "Grand Tree",
    "Shilo Village",
    "Underground Pass",
    "Observatory Quest",
    "Tourist Trap",
    "Watchtower",
    "Dwarf Cannon",
    "Murder Mystery",
    "Dig Site",
    "Gertrude's Cat",
    "Legends' Quest",
    "Big Chompy Bird Hunting",
    "Elemental Workshop I",
    "Priest in Peril",
    "Nature Spirit",
    "Death Plateau",
    "Troll Stronghold",
    "Tai Bwo Wannai Trio",
    "Regicide",
    "Eadgar's Ruse",
    "Shades of Mort'ton",
    "Fremennik Trials",
    "Horror from the Deep",
    "Throne of Miscellania",
    "Monkey Madness I",
    "Haunted Mine",
    "Troll Romance",
    "In Search of the Myreque",
    "Creature of Fenkenstrain",
    "Roving Elves",
    "Ghosts Ahoy",
    "One Small Favour",
    "Mountain Daughter",
    "Between a Rock...",
    "Feud",
    "Golem",
    "Desert Treasure I",
    "Icthlarin's Little Helper",
    "Tears of Guthix",
    "Zogre Flesh Eaters",
    "Lost Tribe",
    "Giant Dwarf",
    "Recruitment Drive",
    "Mourning's End Part I",
    "Forgettable Tale...",
    "Garden of Tranquillity",
    "Tail of Two Cats",
    "Wanted!",
    "Mourning's End Part II",
    "Rum Deal",
    "Shadow of the Storm",
    "Making History",
    "Ratcatchers",
    "Spirits of the Elid",
    "Devious Minds",
    "Hand in the Sand",
    "Enakhra's Lament",
    "Cabin Fever",
    "Fairytale I - Growing Pains",
    "Recipe for Disaster",
    "Recipe for Disaster/Another Cook's Quest",
    "Recipe for Disaster/Freeing the Mountain Dwarf",
    "Recipe for Disaster/Freeing the Goblin generals",
    "Recipe for Disaster/Freeing Pirate Pete",
    "Recipe for Disaster/Freeing the Lumbridge Guide",
    "Recipe for Disaster/Freeing Evil Dave",
    "Recipe for Disaster/Freeing King Awowogei",
    "Recipe for Disaster/Freeing Sir Amik Varze",
    "Recipe for Disaster/Freeing Skrach Uglogwee",
    "Recipe for Disaster/Defeating the Culinaromancer",
    "In Aid of the Myreque",
    "Soul's Bane",
    "Rag and Bone Man I",
    "Swan Song",
    "Royal Trouble",
    "Death to the Dorgeshuun",
    "Fairytale II - Cure a Queen",
    "Lunar Diplomacy",
    "Eyes of Glouphrie",
    "Darkness of Hallowvale",
    "Slug Menace",
    "Elemental Workshop II",
    "My Arm's Big Adventure",
    "Enlightened Journey",
    "Eagles' Peak",
    "Animal Magnetism",
    "Contact!",
    "Cold War",
    "Fremennik Isles",
    "Tower of Life",
    "Great Brain Robbery",
    "What Lies Below",
    "Olaf's Quest",
    "Another Slice of H.A.M.",
    "Dream Mentor",
    "Grim Tales",
    "King's Ransom",
    "Monkey Madness II",
    "Client of Kourend",
    "Rag and Bone Man II",
    "Bone Voyage",
    "Queen of Thieves",
    "Depths of Despair",
    "Dragon Slayer II",
    "Tale of the Righteous",
    "Taste of Hope",
    "Making Friends with My Arm",
    "Forsaken Tower",
    "Ascent of Arceuus",
    "Song of the Elves",
    "Fremennik Exiles",
    "Sins of the Father",
    "Porcine of Interest",
    "Getting Ahead",
    "Night at the Theatre",
    "Kingdom Divided",
    "Land of the Goblins",
    "Temple of the Eye",
    "Beneath Cursed Sands",
    "Sleeping Giants",
    "Garden of Death",
    "Secrets of the North",
    "Desert Treasure II - Fallen Empire",
    "Path of Glouphrie",
    "Children of the Sun",
    "Defender of Varrock",
    "Twilight's Promise",
    "At First Light",
    "Perilous Moons",
    "Ribbiting Tale of a Lily Pad Labour Dispute",
    "While Guthix Sleeps"
].sort((x, y) => x < y ? -1 : 1);
const diaries = ["Fremennik", "Lumbridge & Draynor", "Kourend & Kerbos", "Western Provinces", "Ardougne", "Desert", "Falador", "Kandarin", "Karamja", "Morytania", "Varrock", "Wilderness"].sort((x, y) => x < y ? -1 : 1).flatMap(x => ["Easy", "Medium", "Hard", "Elite"].map(y => x + " " + y));
const kourends = ["Arceuus", "Hosidius", "Piscarilius", "Lovakengj", "Shayzien"].sort((x, y) => x < y ? -1 : 1);
const areaNames = ["Any", "Asgarnia", "Desert", "Fremennik", "Kandarin", "Karamja", "Kourend", "Misthalin", "Morytania", "Tirannwn", "Wilderness","Varlamore"].sort((x, y) => x < y ? -1 : 1);
const skillNames = ["Any", "Combat", "Base", "Total", "Attack", "Hitpoints", "Mining", "Strength", "Agility", "Smithing", "Defence", "Herblore", "Fishing", "Ranged", "Thieving", "Cooking", "Prayer", "Crafting", "Firemaking", "Magic", "Fletching", "Woodcutting", "Runecraft", "Slayer", "Farming", "Construction", "Hunter"].sort((x, y) => x < y ? -1 : 1);


export type QuestionConfig = {
    key: string;
    label?: string;
    multiple?: boolean;
    type: "string" 
        | "number" 
        | "select"
        | KeyValueQuestion
        | QuestionConfig[];
    options?: string[];
    min?: number;
    max?: number;
    map?: (val: any) => any
}

export type KeyValueQuestion = {
    keyQuestion: {type: "string" | "number" | "select", options?: string[], min?: number; max?: number};
    valueQuestion: {type: "string" | "number" | "select", options?: string[], min?: number; max?: number};
}

export type EditorConfig = {
    questions: QuestionConfig[];
    multiple?: boolean;
}

export const editorConfig: EditorConfig = {
    questions: [
        {
            key: 'skills',
            type: {
                keyQuestion: {type: "select", options: skillNames},
                valueQuestion: {type: "number", min: 1, max: 99}
            }
        },
        {
            key: 'quests',
            type: 'select',
            options: questNames,
            multiple: true
        },
        {
            key: 'diary',
            type: 'select',
            options: diaries,
            multiple: true
        },
        {
            key: 'kourend',
            type: {
                keyQuestion: {type: "select", options: kourends},
                valueQuestion: {type: "number", min: 0, max: 100}
            }
        },
        {
            key: 'areas',
            type: "select",
            multiple: true,
            options: areaNames,
            map: (a) => a.length == 1 ? a[0] : a
        },
        {
            key: 'links',
            multiple: true,
            type: [{
                key: 'href',
                type: 'string'
            },{
                key: 'text',
                type: 'string'
            }]
        },{
            key: 'coins',
            type: 'number'
        }
    ],
    multiple: true
}
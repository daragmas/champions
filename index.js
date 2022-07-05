const classSelector = document.getElementById('class-select')
const apiURL = 'https://www.dnd5eapi.co/api/'
const baseImageURL = 'https://www.dndbeyond.com/attachments/thumbnails/0/'
const portraitMap = {
    'barbarian': '679/400/417/c3barbarianintro.png',
    'bard': '684/400/406/c3bardintro.png',
    'cleric': '687/380/437/c3clericintro.png',
    'druid': '693/400/399/c3druidintro.png',
    'fighter': '697/400/475/c3fighterintro.png',
    'paladin': '701/400/473/c3paladinintro.png',
    'monk': '700/400/490/c3monkintro.png',
    'ranger': '707/400/444/c3rangerintro.png',
    'rogue': '709/375/480/c3rogueintro.png',
    'sorcerer': '712/400/517/c3sorcererintro.png',
    'wizard': '717/400/484/c3wizardintro.png',
    'warlock': '716/400/512/c3warlockintro.png'
}
/* To Do:
    Fix proficiency list when saving a character
    Stop page from refreshing when saving a character
*/

const charImg = document.getElementById('character-img')
const profList = document.getElementById('proficiency-list')
const charName = document.getElementById('character-name')
const profListLabel = document.getElementById('prof-list-label')
const spellListLabel = document.getElementById('spell-list-label')
const spellList = document.getElementById('spell-list')
const newCharacterBtn = document.getElementById('create-new-character')

const savedCharacterSelector = document.getElementById('created-characters')
const savedProfList = document.getElementById('saved-proficiency-list')
const savedCharImg = document.getElementById('saved-character-img')
const savedCharName = document.getElementById('saved-character-name')
const savedProfListLabel = document.getElementById('saved-prof-list-label')
const savedSpellListLabel = document.getElementById('saved-spell-list-label')
const savedSpellList = document.getElementById('saved-spell-list')

let request = async (url) => {
    let req = await fetch(url)
    let res = await req.json()
    return res
}

let classSelectorPopulate = async () => {
    res = await request(`${apiURL}classes`)
    res.results.forEach((className) => {
        let classOption = document.createElement('option')
        classOption.textContent = className.name
        classOption.value = className.name
        classSelector.appendChild(classOption)
    })
}

let savedCharactersPopulate = async () => {
    res = await request('http://localhost:3000/characters')
    // console.log(res)
    res.forEach((savedCharacter) => {
        let savedCharacterOption = document.createElement('option')
        savedCharacterOption.textContent = savedCharacter.name
        savedCharacterOption.value = savedCharacter.name
        savedCharacterSelector.appendChild(savedCharacterOption)
    })
}

classSelector.addEventListener('change', async (e) => {
    let classTarget = e.target.value
    document.getElementById('selected-class').innerText = classTarget
    let src = `${baseImageURL}${portraitMap[classTarget.toLowerCase()]}`
    charImg.src = src
    charImg.classList.remove('hidden')

    profList.innerHTML = ''

    res = await request(`${apiURL}classes/${classTarget.toLowerCase()}`)

    res.proficiencies.forEach((prof) => {
        let li = document.createElement('li')
        li.innerText = prof.name
        profList.append(li)
    })

    res = await request(`${apiURL}/classes/${classTarget.toLowerCase()}/spells`)

    spellList.innerHTML = ''

    let allSpells = []
    res.results.forEach((spell) => { allSpells.push(spell.name) })

    if (allSpells.length != 0) {
        spellList.classList.remove('hidden')
        spellListLabel.classList.remove('hidden')
        let spellLevel
        if (allSpells.length < 60) { spellLevel = 1 }
        else { spellLevel = 0 }

        for (spellLevel; spellLevel < 10; spellLevel++) {
            if (allSpells.length == 0) { break }
            else {
                let ul = document.createElement('ul')
                ul.innerText = spellLevel
                ul.className = `${spellLevel}-level-spells`
                let whileLoopBoolean = true
                while (whileLoopBoolean) {
                    let li = document.createElement('li')
                    li.innerText = allSpells[0]
                    ul.append(li)

                    if (allSpells[0] < allSpells[1]) {
                        allSpells.shift()
                    }
                    else {
                        allSpells.shift()
                        whileLoopBoolean = false
                    }
                }
                spellList.append(ul)
            }
        }
    }
    else if (spellListLabel.classList[0] != ('hidden')) {
        spellListLabel.className = 'hidden'
        spellList.className = 'hidden'
    }

    profList.classList.remove('hidden')
    charName.classList.remove('hidden')
    profListLabel.classList.remove('hidden')


})

charName.addEventListener('click', async () => {
    let currentName = charName.textContent
    charName.textContent = prompt('Rename Character', currentName)
    if (!charName.textContent) { charName.textContent = currentName }

})

newCharacterBtn.addEventListener('click', async (e) => {
    e.preventDefault()
    let newCharProfs = profList.innerHTML.split('<li>')
    let moddedNewCharProfs = []
    newCharProfs.shift()
    newCharProfs.forEach((p)=>{
        p=p.split('<')
        p=p.shift()
        moddedNewCharProfs.push(p)
    })
    console.log(newCharProfs)
    console.log(moddedNewCharProfs)
    const newCharacter = {
            name: charName.textContent,
            class: classSelector.value,
            proficiencies: moddedNewCharProfs,
            imgURl: charImg.src,
            // classSpellList : spellList.textContent
        }

    fetch('http://localhost:3000/characters', {
        method: 'POST',
        body: JSON.stringify(newCharacter),
        headers: { 'Content-type': "application/json; charset=UTF-8" }
    })
})

savedCharacterSelector.addEventListener('change', async (e) => {
    let targetChar = e.target.value
    res = await request(`http://localhost:3000/characters/`)
    let savedCharIndex = res.findIndex((c)=>c.name===targetChar)
    let savedCharData = res[savedCharIndex]
    savedProfList.innerHTML=''

    savedCharData.proficiencies.forEach((proficiency) => {
        let li = document.createElement('li')
        li.innerText = proficiency
        savedProfList.append(li)
    })

    savedCharImg.setAttribute('src', `${savedCharData.imgUrl}`)
    savedCharImg.setAttribute('alt', `${savedCharData.name} the ${savedCharData['class']}`)

    savedCharName.textContent = savedCharData.name
    savedProfList.classList.remove('hidden')
    savedCharImg.classList.remove('hidden')
    savedCharName.classList.remove('hidden')
    savedProfListLabel.classList.remove('hidden')
    savedSpellListLabel.classList.remove('hidden')
    savedSpellList.classList.remove('hidden')
})

classSelectorPopulate()
savedCharactersPopulate()

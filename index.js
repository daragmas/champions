const classSelector = document.getElementById('class-select')
const apiURL = 'https://www.dnd5eapi.co/api/'
const baseImageURL = 'https://www.dndbeyond.com/attachments/thumbnails/0/'
const portraitMap = {
    'barbarian': '679/400/417/c3barbarianintro.png',
    'bard': '684/400/406/c3bardintro.png',
    'cleric': '687/380/437/c3clericintro.png',
    'druid': '693/400/399/c3druidintro.png',
    'fighter':'697/400/475/c3fighterintro.png',
    'paladin': '701/400/473/c3paladinintro.png',
    'monk': '700/400/490/c3monkintro.png',
    'ranger': '707/400/444/c3rangerintro.png',
    'rogue': '709/375/480/c3rogueintro.png',
    'sorcerer':'712/400/517/c3sorcererintro.png',
    'wizard':'717/400/484/c3wizardintro.png',
    'warlock':'716/400/512/c3warlockintro.png'
}
/* To Do:
    Look into portraitMap, and see how to add multiple objects to a class
    Add spellcaster Boolean to classes to denote which ones need spell list look ups
    Get spells by class, seperate spells by spell level

    Add character naming
    Add character saving
    Add multiple character slots
*/ 

const charImg=document.getElementById('character-img')
const profList = document.getElementById('proficiency-list')
const charName = document.getElementById('character-name')
const profListLabel = document.getElementById('prof-list-label')
const spellListLabel = document.getElementById('spell-list-label')
const spellList = document.getElementById('spell-list')

let request = async ()=>{
    let req = await fetch(`${apiURL}/classes`)
    let res = await req.json()
    res.results.forEach((className)=>{
        let classOption = document.createElement('option')
        classOption.textContent = className.name
        classOption.value = className.name
        classSelector.appendChild(classOption)
    })

    classSelector.addEventListener('change', async (e)=>{
        let classTarget = e.target.value
        document.getElementById('selected-class').innerText = classTarget        
        let src=`${baseImageURL}${portraitMap[classTarget.toLowerCase()]}`
        charImg.src=src
        charImg.classList.remove('hidden')

        req = await fetch(`${apiURL}/classes/${classTarget.toLowerCase()}`)
        res= await req.json()
        profList.innerHTML=''

        res.proficiencies.forEach((prof)=>{
            let li = document.createElement('li')
            li.innerText = prof.name
            profList.append(li)
        })

        req = await fetch(`${apiURL}/classes/${classTarget.toLowerCase()}/spells`)
        res = await req.json()
        spellList.innerHTML=''

        let allSpells = []
        res.results.forEach((spell) => {allSpells.push(spell.name)})
        console.log(allSpells)

        for(var spellLevel = 0; spellLevel < 10; spellLevel++)
        {
            let ul = document.createElement('ul')
            ul.innerText = spellLevel
            let whileLoopBoolean = true
            while(whileLoopBoolean){
                if(allSpells[0] < allSpells[1]){
                    let li = document.createElement('li')
                    li.innerText=allSpells[0]
                    ul.append(li)
                    allSpells.shift()
                }
                else{
                    let li = document.createElement('li')
                    li.innerText = allSpells[0]
                    ul.append(li)
                    allSpells.shift()  
                    whileLoopBoolean = false
                }

            }
            
            spellList.append(ul)
            
        }
            // let li = document.createElement('li')
            // li.innerText=spell.name
            // spellList.append(li)

        if(allSpells){
            spellList.classList.remove('hidden')
            spellListLabel.classList.remove('hidden')
        }
        else if(spellListLabel.classList[0]!=('hidden')){
            spellListLabel.className = 'hidden'
            spellList.className = 'hidden'
        }


        profList.classList.remove('hidden')
        charName.classList.remove('hidden')
        profListLabel.classList.remove('hidden')
        

    })

    charName.addEventListener('click', async () =>{
        let currentName = charName.textContent
        charName.textContent = prompt('Rename Character',currentName)
        if (!charName.textContent){charName.textContent=currentName}

    })
}

request()
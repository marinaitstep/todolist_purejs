class Application {
    constructor(param) {
        const app = this
        this.el = param.el
        
        this.el.innerHTML = ''
        this.el.append(this.getBasicDOM())

        const panelElement = this.el.querySelector('[data-panel]')
        panelElement
            .querySelector('[data-button="done"]')
            .addEventListener("click", event => {
                for (let item of this.list) {
                    if (item.selected) {
                        item.done = !item.done
                        item.selected = false
                    }
                }
                this.update()
            })
       
        panelElement
            .querySelector('[data-button="archive"]')
            .addEventListener("click", event => {
                for (let item of this.list) {
                    if (item.selected) {
                        item.archived = true
                        item.selected = false
                    }
                }
                this.update()
            })
       
        this.el
            .querySelector('input')
            .addEventListener('keydown', function (event) {
                if (event.key !== "Enter" || !this.value.trim())
                    return
                
                const id = Math.max(0,...app.list.map(x => x.id))+1
                app.list.push({
                    id,
                    content: this.value.trim(),
                    selected: false,
                    done: false,
                    archived: false
                })

                app.list = app.list.sort((a,b)=> b.id - a.id)

                this.value = ''
                app.update()
            })
        
        if (localStorage.getItem("__TODO_APPLICATION__")) {
            this.list = JSON.parse(localStorage.getItem("__TODO_APPLICATION__"))
        }
        else {
             this.list = [
            {id: 7, content: 'Поучить английский', selected: false, done: false, archived: true},
            {id: 6, content: 'Позаниматься спортом', selected: false, done: false, archived: false},
            {id: 5, content: 'Почитать', selected: false, done: true, archived: false},
            {id: 4, content: 'Покодить', selected: false, done: true, archived: false},
            {id: 3, content: 'Позвонить маме', selected: true, done: false, archived: false},
            {id: 2, content: 'Помыть машину', selected: true, done: false, archived: false},
            {id: 1, content: 'Купить хлеб', selected: false, done: false, archived: false},
        ]
        }
        
       

        this.update()        

    }

    get someSelected() {
        return this.items.some(item => item.selected)
    }

    get items() {
        return this.list.filter(item => !item.archived)
    }

    get archiveditems() {
        return this.list.filter(item => item.archived)
    }

    update() {
        const app = this

        localStorage.setItem("__TODO_APPLICATION__", JSON.stringify(this.list))

        const titleArchive = this.el.querySelector('[data-button="deleteall"]')
         titleArchive.addEventListener('click', function (event) {
                
                    app.list = app.list.filter(item => !item.archived)
                app.update()
            })

        const ulElementArchive = this.el.querySelector('[data-archive]')
        ulElementArchive.innerHTML = ''

        const ulElement = this.el.querySelector('[data-items]')
        ulElement.innerHTML = ''

        for (const archiveitem of this.archiveditems) {
            const liElementArchive = this.getArchiveDOM(archiveitem)
            ulElementArchive.append(liElementArchive)

           

            liElementArchive.addEventListener('click', function (event) {
                if (event.target.tagName === 'BUTTON') {
                    const action = event.target.getAttribute("data-button")
                    if (action === "restore") {
                        archiveitem.archived = false
                        app.update()
                    }
                    if (action === "delete") {
                        const index = app.list.indexOf(archiveitem)
                        app.list.splice(index,1)
                        app.update()
                    }
                }
            })
        }
        
        for (const item of this.items) {
            const liElement = this.getItemDOM(item)
            ulElement.append(liElement)
           

            if (item.selected) {
                liElement.classList.add('active')
            }

            if (item.done) {
                liElement.querySelector('span').classList.add("item-done")
            }

            liElement.addEventListener('click', function (event) {
                if (event.target.tagName === 'BUTTON') {
                    const action = event.target.getAttribute("data-button")

                    if (action === 'archive') {
                        item.archived = true
                        app.update()
                    }
                    else if (action === 'done') {
                        item.done = !item.done
                        app.update()
                    }
                }
                else {
                    item.selected = !item.selected
                    app.update()
                }
            })
        }

        const panelElement = this.el.querySelector('[data-panel]')
        const buttonElements = panelElement.querySelectorAll('[data-button]')
        buttonElements.forEach(element => element.setAttribute('disabled', true))
        if (this.someSelected) {
        buttonElements.forEach(element => element.removeAttribute('disabled'))
            
        }
        
    }

    getItemDOM(item) {
        const ulElement = document.createElement('ul')
        ulElement.innerHTML = `
        <li class="list-group-item">
                <div class="d-flex w-100 justify-content-between">
                    <span>${item.content}</span>
                    <div class="btn-group" role="group" ${this.someSelected ? "style='visibility: hidden'" : ""}>
                        <button type="button" class="btn btn-danger" data-button="archive" >Архив</button>
                        <button type="button" class="btn btn-success" data-button="done">Сделано</button>
                    </div>
                </div>
            </li>`
        
        return ulElement.firstElementChild
    
    }

    getArchiveDOM(archiveitem) {
        const ulElement = document.createElement('ul')
        ulElement.innerHTML = `
        <li class="list-group-item">
                <div class="d-flex w-100 justify-content-between">
                    <span>${archiveitem.content}</span>
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-warning" data-button="restore" >Восстановить</button>
                        <button type="button" class="btn btn-danger" data-button="delete" >Удалить</button>
                    </div>
                </div>
            </li>`
        
        return ulElement.firstElementChild
    
    }

    getBasicDOM() {
        const divElement = document.createElement('div')
        divElement.innerHTML = `
    <div class="container">
        <div class="card" style="max-width: 700px; margin: 10px auto;">
            <ul class="list-group list-group-flush">
                <li class="list-group-item">
                    <div class="d-flex">
                        <input type="text" class="form-control" placeholder="Ещё одно дело">
                        <div class="btn-group" role="group" data-panel >
                            <button type="button" class="btn btn-danger" data-button="archive">Архив</button>
                            <button type="button" class="btn btn-success" data-button="done">Сделано</button>
                        </div>
                    </div>
                </li>
            </ul>
            <ul class="list-group list-group-flush" data-items>
        </div>
         <div class="card" style="max-width: 700px; margin: 10px auto;">
            <div class="text-center bg-danger"><strong>Архив</strong> <button type="button" class="text-right btn btn-success" data-button="deleteall">Очистить</button></div>
            <ul class="list-group list-group-flush" data-archive>
        </div>
    </div>
    
    `
    return divElement.firstElementChild
    }


}


            
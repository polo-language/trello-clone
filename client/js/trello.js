(function () {
  'use strict'
  
  //////////////////////////////////////////////////////////////////////////
  //// Board
  function Board(title) {
    var nextId = 0

    this.title = title
    this.lists = []
    this.cards = {}
    
    this.node = document.createElement('div')
    this.titleNode = document.createElement('div')
    this.listsNode = document.createElement('div')
    
    this.node.id = 'board'
    this.titleNode.id = 'board-title'
    this.listsNode.id = 'board-canvas'

    // new list title form
    this.titleFormNode = buildListTitleForm()
    this.titleNode.appendChild(document.createTextNode(this.title))

    this.getNextId = function() {
      return '_' + (nextId++).toString()
    }
  }

  Board.prototype.render = function () {
    this.lists.push(new List(this, 'Add a list...', 0, true))
    for (var i = 0; i < this.lists.length; ++i) {
      this.listsNode.appendChild(this.lists[i].node)
    }
    this.lists[this.lists.length-1].node.appendChild(this.titleFormNode)
    this.lists[this.lists.length-1].titleNode.onclick = addList(this)
    this.node.appendChild(this.titleNode)
    this.node.appendChild(this.listsNode)
  }

  function buildListTitleForm() {
    var node = document.createElement('form')
    node.innerHTML =
        '<div class="newitem-title-wrapper">' +
            '<input id="list-title-input" type="text">' +
            '<input id="list-title-submit" type="submit" value="Save">' +
        '</div>'
    node.style.display = 'none'
    return node
  }

  function addList(board) {
    return function () {  
      var titleInput = document.getElementById('list-title-input')

      document.getElementById('list-title-submit').onclick = titleButtonClick
      board.titleFormNode.style.display = 'block'
      titleInput.focus()
      
      function titleButtonClick(evt) {
        evt.preventDefault()
        var title = titleInput.value.trim()
          , index = board.lists.length - 1
          , list

        board.titleFormNode.style.display = 'none'
        titleInput.value = ''
        if (!title) { return }

        list = new List(board, title, index)
        board.lists.splice(index, 0, list)
        board.listsNode.insertBefore(list.node,
                                     board.lists[index+1].node)
        board.lists[index+1].titleNode.setAttribute('list-index', index+1)
      }
    }
  }

  Board.prototype.registerCard = function (card, index) {
    this.cards[card.id] =
    { card: card
    , list: card.list
    , index: index
    }
  }

  Board.prototype.reregisterSubsequent = function (list, index, shift) {
    for (var i = index; i < list.cards.length; ++i) {
      this.registerCard(list.cards[i], i + shift)
    }
  }

  Board.prototype.unregisterCard = function (card) {
    delete this.cards[card.id]
  }


  //////////////////////////////////////////////////////////////////////////
  //// List
  function List(board, title, index, dummyList) {
    this.board = board
    this.dummyList = dummyList
    this.title = title
    this.index = index
    this.node = document.createElement('div')
    this.titleNode = document.createElement('div')
    this.cardsNode = document.createElement('div')
    this.node.classList.add('list')
    this.titleNode.classList.add('list-title')
    this.cardsNode.classList.add('list-cards')
    this.titleNode.setAttribute('list-index', index)
    this.titleNode.appendChild(document.createTextNode(this.title))
    this.node.appendChild(this.titleNode)
    
    if (!dummyList) {
      var dummyCard = new Card(this, 'Add a card...', 0)

      this.titleNode.draggable = true
      this.cards = [dummyCard]
      board.registerCard(this.cards[0], 0)

      // new card title form
      this.titleFormNode = buildCardTitleForm()
    
      for (var i = 0; i < this.cards.length; ++i) {
        this.cardsNode.appendChild(this.cards[i].node)
      }
      dummyCard.titleNode.onclick = addCard(this)
      this.node.appendChild(this.cardsNode)
      dummyCard.node.appendChild(this.titleFormNode)
      dummyCard.node.draggable = false
      dummyCard.node.onclick = undefined
    }

    // drag-drop handlers
    this.titleNode.ondragstart = function (evt) {
      var index = parseInt(evt.target.getAttribute('list-index'), 10)
      dragTracker.list = currentBoard.lists[index]
      evt.dataTransfer.effectAllowed = 'move'
    }

    this.titleNode.ondragover = function (evt) {
      if (dragTracker.list) {
        evt.preventDefault()
      }
    }

    this.titleNode.ondrop = function (evt) {
      var sourceIndex = dragTracker.list.index
        , targetIndex = parseInt(this.getAttribute('list-index'), 10)
        , numLists = board.lists.length
        , i

      if (sourceIndex === targetIndex) { return }

      board.listsNode.removeChild(dragTracker.list.node)
      board.listsNode.insertBefore(dragTracker.list.node,
                                   board.lists[targetIndex].node)

      for (i = sourceIndex; i < numLists-1; ++i) {
        board.lists[i] = board.lists[i+1]
        board.lists[i].titleNode.setAttribute('list-index', i)
        board.lists[i].index = i
      }
      for (i = numLists-1; i > targetIndex; --i) {
        board.lists[i] = board.lists[i-1]
        board.lists[i].titleNode.setAttribute('list-index', i)
        board.lists[i].index = i
      }
      board.lists[targetIndex] = dragTracker.list
      board.lists[targetIndex].titleNode.setAttribute('list-index', targetIndex)
      board.lists[targetIndex].index = targetIndex
      evt.preventDefault()
    }

    this.titleNode.ondragend = function () {
      dragTracker.list = undefined
    }
  }

  function buildCardTitleForm() {
    var node = document.createElement('form')
    node.innerHTML =
        '<div class="newitem-title-wrapper">' +
            '<textarea class="newcard-title-input" type="text"></textarea>' +
            '<input class="newcard-title-submit" type="submit" value="Add">' +
        '</div>'
    node.style.display = 'none'
    return node
  }

  function addCard(list) {
    return function () {
      var titleTextarea = list.titleFormNode
                              .getElementsByClassName('newcard-title-input')[0]
      list.titleFormNode.getElementsByClassName('newcard-title-submit')[0]
                        .onclick = titleSubmit
      list.titleFormNode.style.display = 'block'
      titleTextarea.focus()

      function titleSubmit(evt) {
        evt.preventDefault()
        var title = titleTextarea.value.trim()
          , card

        list.titleFormNode.style.display = 'none'
        titleTextarea.value = ''
        if (!title) { return }

        card = new Card(list, title)
        list.board.registerCard(card, list.cards.length)
        list.cardsNode.insertBefore(card.node, list.cards[list.cards.length-1].node)
        list.cards.push(card)
      }
    }
  }


  //////////////////////////////////////////////////////////////////////////
  //// Card
  function Card(list, title) {
    this.id = list.board.getNextId()
    this.list = list
    this.title = title
    this.due = undefined
    this.node = buildCardNode()
    this.titleNode = this.node.getElementsByClassName('card-title')[0]
    this.dueNode = this.node.getElementsByClassName('card-due')[0]
    
    this.node.classList.add('card')
    this.node.setAttribute('card-id', this.id)
    this.titleNode.appendChild(document.createTextNode(this.title))

    // drag-drop handlers
    this.node.ondragstart = (function (id) {
      return function (evt) {
        dragTracker.id = id
        evt.dataTransfer.effectAllowed = 'move'
      }
    }(this.id))

    this.node.ondragover = function (evt) {
      if (dragTracker.id) {
        evt.preventDefault()
      }
    }

    this.node.ondrop = (function (board) {
      return function (evt) {
        var id = dragTracker.id
          , targetId = this.getAttribute('card-id') // 'this' is target of drop
          , source = board.cards[id]
          , target = board.cards[targetId]

        if (id === targetId) { return }

        source.list.cardsNode.removeChild(source.card.node)
        target.list.cardsNode.insertBefore(source.card.node, target.card.node)

        board.reregisterSubsequent(source.list, source.index + 1, -1)
        source.list.cards.splice(source.index, 1)

        board.reregisterSubsequent(target.list, target.index + 1, 1)
        target.list.cards.splice(target.index + 1, 0, source.card)

        source.card.list = target.list
        board.registerCard(source.card, target.index + 1)
        evt.preventDefault()
      }
    }(list.board))

    this.node.ondragend = function () {
      dragTracker.id = undefined
    }

    // click opens card editing panel
    this.node.onclick = (function (card) {
      return function () {
        cardEdit.card = card
        cardEdit.titleNode.value = card.title
        cardEdit.dueNode.value = card.due || '' // use empty string if undefined (IE)
        cardEdit.show()
      }
    }(this))
  }

  function buildCardNode() {
    var node = document.createElement('div')
    node.draggable = true
    node.innerHTML =
        '<div class="card-title"></div>' +
        '<div class="card-due"></div>'
    return node
  }


  //////////////////////////////////////////////////////////////////////////
  //// Drag tracking
  var dragTracker =
  { id: undefined
  , list: undefined
  }


  //////////////////////////////////////////////////////////////////////////
  //// Card edit
  var cardEdit = 
  { node: document.getElementById('card-edit')
  , windowOverlay: document.getElementById('window-overlay')
  , titleNode: document.getElementById('card-edit-title')
  , dueNode: document.getElementById('card-edit-due')
  , card: undefined
  }

  cardEdit.clearInputs = function () {
    cardEdit.titleNode.value = ''
    cardEdit.dueNode.value = ''
  }

  cardEdit.close = function() {
    cardEdit.card = undefined
    cardEdit.clearInputs()
    cardEdit.node.style.display = 'none'
    cardEdit.windowOverlay.style.display = 'none'
  }

  cardEdit.show = function () {
    cardEdit.windowOverlay.style.display = 'block'
    cardEdit.node.style.display = 'block'
  }

  cardEdit.submit = function (evt) {
    evt.preventDefault()
    var title = cardEdit.titleNode.value.trim()
      , due = cardEdit.dueNode.value

    if (title) {
      cardEdit.card.title = title
      cardEdit.card.titleNode.replaceChild(document.createTextNode(title),
                                           cardEdit.card.titleNode.childNodes[0])
    }
    if (due) {
      cardEdit.card.due = due
      if (cardEdit.card.dueNode.childNodes.length > 0) {
        cardEdit.card.dueNode.replaceChild(document.createTextNode('Due on: ' + due),
                                           cardEdit.card.dueNode.childNodes[0])
      } else {
        cardEdit.card.dueNode.appendChild(document.createTextNode('Due on: ' + due))
      }
    }
    cardEdit.close()
  }

  document.getElementById('card-edit-close').onclick = cardEdit.close

  document.getElementById('card-edit-submit').onclick = cardEdit.submit

  document.getElementById('card-edit-delete').onclick = function () {
    var index = currentBoard.cards[cardEdit.card.id].index

    currentBoard.unregisterCard(cardEdit.card)
    currentBoard.reregisterSubsequent(cardEdit.card.list, index + 1, -1)

    cardEdit.card.list.cardsNode.removeChild(cardEdit.card.node)
    cardEdit.card.list.cards.splice(index, 1)
    
    cardEdit.close()
    cardEdit.card = undefined
  }

  cardEdit.windowOverlay.onclick = cardEdit.close

  window.onkeydown = function(evt) {
    if (evt.keyCode === 27 ) {
      cardEdit.close()
    }
  }


  //////////////////////////////////////////////////////////////////////////
  //// Actions
  function Action(board, type, label) {
    var action = new ActionFactory(type, label)
    board.logAction(action)
    return action
  }

  function ActionFactory(type, label) {
    this.date = new Date()
    this.type = type
    this.desc = Action.prototype.getActionDesc(type, label)
  }

  Action.prototype.getActionDesc = function (type, label) {
    var ACTION_STRINGS =
    { 'createList': 'Added {desc} to this board'
    , 'createCard': 'Added {desc} to this list'
    }
    return ACTION_STRINGS[type].replace('{desc}', label) +
           ' at ' + this.date.toLocaleTimeString();
  }


  //////////////////////////////////////////////////////////////////////////
  //// 'main'
  var currentBoard

  document.body.onload = function () {
    var title = 'New Board'
      , board = new Board(title)

    board.render()
    document.getElementById('container').appendChild(board.node)
    currentBoard = board
  }
}())

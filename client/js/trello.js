'use strict'

//////////////////////////////////////////////////////////////////////////
//// Board
function Board(title) {
  // var nextId = 0

  this.lists = [new List(undefined, 'Add a list...', true)]
  this.title = title
  
  this.node = document.createElement('div')
  this.titleNode = document.createElement('div')
  this.listsNode = document.createElement('div')
  
  this.node.id = 'board'
  this.titleNode.id = 'board-title'
  this.listsNode.id = 'board-canvas'
  this.node.style.height = document.documentElement.clientHeight
  this.node.style.width = document.documentElement.clientWidth

  // new list title form
  this.titleFormNode = document.createElement('form')
  this.titleFormNode.innerHTML =
      '<div class="newitem-title-wrapper">' +
          '<input id="list-title-input" type="text">' +
          '<input id="list-title-submit" type="submit" value="Save">' +
      '</div>'
  this.titleFormNode.style.display = 'none'
  
  // this.getNextId = function() {
  //   return nextId++
  // }
}

Board.prototype.render = function () {
  this.titleNode.appendChild(document.createTextNode(this.title))
  for (var i = 0; i < this.lists.length; ++i) {
    this.lists[i].render()
    this.listsNode.appendChild(this.lists[i].node)
  }
  this.lists[this.lists.length-1].node.appendChild(this.titleFormNode)
  this.lists[this.lists.length-1].titleNode.onclick = addList(this)
  this.node.appendChild(this.titleNode)
  this.node.appendChild(this.listsNode)
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
        , list

      board.titleFormNode.style.display = 'none'
      titleInput.value = ''
      if (!title) { return }
      

      list = new List(board, title)
      board.lists.splice(board.lists.length-1, 0, list)    
      list.render()
      board.listsNode.insertBefore(list.node,
                                   board.lists[board.lists.length-1].node)
    }
  }
}

Board.prototype.removeList = function () { /* TODO */ }

Board.prototype.logAction = function (action) { /* TODO */ }


//////////////////////////////////////////////////////////////////////////
//// List
function List(board, title, dummyList) {
  this.board = board
  this.dummyList = dummyList
  this.title = title
  this.node = document.createElement('div')
  this.titleNode = document.createElement('div')
  this.cardsNode = document.createElement('div')
  this.node.classList.add('list')
  this.titleNode.classList.add('list-title')
  this.cardsNode.classList.add('list-cards')
  
  if (!dummyList) {
    this.cards = [new Card(this, 'Add a card...', 0)]
    // new card title form
    this.titleFormNode = document.createElement('form')
    this.titleFormNode.innerHTML =
        '<div class="newitem-title-wrapper">' +
            '<textarea class="newcard-title-input" type="text"></textarea>' +
            '<input class="newcard-title-submit" type="submit" value="Add">' +
        '</div>'
    this.titleFormNode.style.display = 'none'
  }
}

List.prototype.render = function () {
  this.titleNode.appendChild(document.createTextNode(this.title))
  this.node.appendChild(this.titleNode)
  
  if (!this.dummyList) {
    for (var i = 0; i < this.cards.length; ++i) {
      this.cards[i].render()
      this.cardsNode.appendChild(this.cards[i].node)
    }
    this.cards[0].titleNode.onclick = addCard(this)
    this.node.appendChild(this.cardsNode)
    this.cards[0].node.appendChild(this.titleFormNode)
  }
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


      card = new Card(list, title, list.cards.length)
      list.cards.push(card)
      card.render()
      list.cardsNode.insertBefore(card.node, list.cards[list.cards.length-2].node)

    }
  }
}

List.prototype.removeCard = function () { /* TODO */ }


//////////////////////////////////////////////////////////////////////////
//// Card
function Card(list, title, index) {
  this.list = list
  this.index = index
  // this.id = list.board.getNextId()
  this.title = title
  this.desc = ''
  this.due = undefined
  // this.badges = {}
  // this.actions = []
  this.node = buildCardNode()
  this.node.classList.add('card')
  this.titleNode = this.node.getElementsByClassName('card-title')[0]
  this.descNode = this.node.getElementsByClassName('card-desc')[0]
  this.dueNode = this.node.getElementsByClassName('card-due')[0]
}

function buildCardNode() {
  var node = document.createElement('div')
  node.innerHTML =
      '<div class="card-title"></div>' +
      '<div class="card-desc"></div>' +
      '<div class="card-due"></div>'
  return node
}

Card.prototype.render = function () {
  this.titleNode.appendChild(document.createTextNode(this.title))
  this.node.appendChild(this.titleNode)
}

Card.prototype.edit = function () { /* TODO */ }


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
var bodyEl = document.getElementsByTagName('body')
bodyEl.onload = render()

function render() {
  var containerEl = document.getElementById('container')
  var title = 'New Board'   // TODO input title
  buildBoard(containerEl, title)
}

function buildBoard(containerEl, title) {
  var board = new Board(title)
  board.render()
  containerEl.appendChild(board.node)
}


//////////////////////////////////////////////////////////////////////////
//// Utilities

// function getNow() {
//   return (new Date()).toISOString()
// }
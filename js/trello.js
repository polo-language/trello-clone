'use strict'

//////////////////////////////////////////////////////////////////////////
//// Board
function Board(title) {
  var nextId = 0

  this.lists = [new List(undefined, 'New list...')]
  this.title = title

  this.getNextId = function() {
    return nextId++
  }
}

Board.prototype.addList = function () {
// DEBUG:  TODO open lightbox for title input
  var title = 'New list ' + Math.random()
    , list = new List(this, title)
  this.lists.splice(this.lists.length-1, 0, list)
  // TODO: re-render
}

Board.prototype.render = function () {
  var boardEl = document.createElement('div')
    , boardTitleEl = document.createElement('div')
    , boardCanvasEl = document.createElement('div')
    , listEls = []
  boardTitleEl.classList.add('board-title')
  boardCanvasEl.classList.add('board-canvas')
  for (var i = 0; i < this.lists.length; ++i) {
    listEls[i] = this.lists[i].render()
    boardCanvasEl.appendChild(listEls[i])
  }
  listEls[this.lists.length-1].onclick = this.addList
  boardEl.appendChild(boardTitleEl)
  boardEl.appendChild(boardCanvasEl)
  return boardEl
}

Board.prototype.removeList = function () { /* TODO */ }

Board.prototype.logAction = function (action) { /* TODO */ }


//////////////////////////////////////////////////////////////////////////
//// List
function List(board, title) {
  this.board = board
  this.title = title
  this.cards = []
  
  // if (newList) {  // for per-board-singleton 'new list' list only
  //   this.title = 'New list...'
  //   this.cards = []
  //   this.click = board.addList()
  // } else {
  //   this.title = title
  //   this.cards = [new Card(this, undefined, true)]
  //   this.actions = [new Action(board, 'createList', title)]
  //   this.click = undefined   // no click functionality for existing list
  // }
}

List.prototype.render = function () {
  var listEl = document.createElement('div')
    , listTitleEl = document.createElement('div')
    , listCardsEl = document.createElement('div')
  listEl.classList.add('list')
  listTitleEl.classList.add('list-title')
  listCardsEl.classList.add('list-cards')
  for (var i = 0; i < this.cards.length; ++i) {
    listCardsEl.appendChild(this.cards[i].render())
  }
  listEl.appendChild(listTitleEl)
  listEl.appendChild(listCardsEl)
  return listEl
}

List.prototype.addCard = function () { /* TODO */ }

List.prototype.removeCard = function () { /* TODO */ }


//////////////////////////////////////////////////////////////////////////
//// Card
function Card(list, title, newCard) {
  this.list = list
  this.id = list.board.getNextId()
  this.badges = {}
  this.desc = ''
  this.due = undefined
  if (newCard) {  // for per-list-singleton 'new card' card only
    this.title = 'New card...'
    this.actions = []
    this.click = list.addCard()
  } else {
    this.title = title
    this.actions = [new Action(list.board, 'createCard', title)]
    this.click = this.edit()
  }
}

Card.prototype.render = function () { /* TODO */ }

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
  containerEl.appendChild(board.render())
}


//////////////////////////////////////////////////////////////////////////
//// Utilities

// function getNow() {
//   return (new Date()).toISOString()
// }

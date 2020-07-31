import React, { Component } from 'react'

import config from '../../config'
import TokenService from '../../services/token-service'
import Button from '../../components/Button/Button'
import UserContext from '../../contexts/UserContext'
import './LearningRoute.css'

class LearningRoute extends Component {
  static contextType = UserContext

  state = {
    totalScore: 0,
    nextWord: '',
    answeredWord: '',
    correctScore: 0,
    incorrectScore: 0,
    desc: '',
    answered: false,
    isCorrect: null,
    guess: '',
    translation: '',
  }

  componentDidMount = () => {
    this.getNewWord()
  }

  getNewWord = () => {
    fetch(`${config.API_ENDPOINT}/language/head`, {
      headers: {
        'authorization': `Bearer ${TokenService.getAuthToken()}`
      }
    })
    .then(res => {
      if(!res.ok)
        return res.json().then(e => Promise.reject(e))
      return res.json()
    })
    .then(data => {
      this.setState({ 
        totalScore: data.totalScore,
        nextWord: data.nextWord,
        correctScore: data.wordCorrectCount,
        incorrectScore: data.wordIncorrectCount,
        desc: data.wordDescription, 
        answered: false,
        isCorrect: null
      })
    })
    .catch(err =>{
      console.log(err)
    })
  }

  handleGuess = ev => {
    ev.preventDefault()
    const guess = ev.target.elements[0].value

  fetch(`${config.API_ENDPOINT}/language/guess`, {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${TokenService.getAuthToken()}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({guess: guess})
  })
  .then(res => {
    if(!res.ok)
      return res.json().then(e => Promise.reject(e))
    return res.json()
  })
  .then(data => {
    this.setState({
        answeredWord: this.state.nextWord,
        nextWord: data.nextWord,
        correctScore: data.wordCorrectCount,
        incorrectScore: data.wordIncorrectCount,
        totalScore: data.totalScore,
        isCorrect: data.isCorrect,
        translation: data.answer,
        answered: true,
        guess: guess,
    })
  })
  .catch(err =>{
    console.log(err)
  })
}

  render() {
    if(this.state.answered === false) {
      return (
        <section>
          <h2>Translate the word:</h2>
          <span className='word-to-guess hidden'>{this.state.nextWord}</span>
          <div><img src={this.state.nextWord} alt={this.state.desc}/></div>
  
          <p>Your total score is: {this.state.totalScore}</p>
  
          <form className='quess' onSubmit={(ev) => this.handleGuess(ev)}>
            <label htmlFor='learn-guess-input'>What's the translation for this word?</label>
            <input required id='learn-guess-input' className='learn-guess-input' type='text'></input>
            <Button type='submit'>Submit your answer</Button>
          </form>
          <p className='word-stats'>You have answered this word correctly {this.state.correctScore} times.</p>
          <p className='word-stats'>You have answered this word incorrectly {this.state.incorrectScore} times.</p>
        </section>
      );
    }
    else if (this.state.answered === true && this.state.isCorrect === true) {
      return (
        <section>
          <div className='DisplayScore'>
            <p>Your total score is: {this.state.totalScore}</p>
          </div>
          <h2>You were correct! :D</h2>
          <div className='DisplayFeedback'>
            <p className='hidden'>The correct translation for {this.state.answeredWord} was {this.state.translation} and you chose {this.state.guess}!</p>
          </div>
          <Button type='button' onClick={() => this.setState({answered: false})}>Try another word!</Button>
        </section>
      );
    }
    else if (this.state.answered === true && this.state.isCorrect === false) {
      return (
        <section>
          <div className='DisplayScore'>
            <p>Your total score is: {this.state.totalScore}</p>
          </div>
          <h2>Good try, but not quite right :(</h2>
          <div className='DisplayFeedback'>
            <p>The correct translation for {this.state.answeredWord} was {this.state.translation} and you chose {this.state.guess}!</p>
          </div>
          <Button type='button' onClick={() => this.setState({answered: false})}>Try another word!</Button>
        </section>
      );
    }
  }
}

export default LearningRoute

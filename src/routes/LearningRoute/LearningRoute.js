import React, { Component } from 'react'
import {withRouter} from 'react-router'

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
    correctScore: 0,
    incorrectScore: 0,
    desc: '',
  }

  componentDidMount = () => {
    console.log('context for user: ', this.context)
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
      console.log(data)
      this.setState({ 
        totalScore: data.totalScore,
        nextWord: data.nextWord,
        correctScore: data.wordCorrectCount,
        incorrectScore: data.wordIncorrectCount,
        desc: data.wordDescription 
      })
    })
    .catch(err =>{
      console.log(err)
    })
  }
  render() {
    return (
      <section>
        <h2>Translate the word:</h2>
        <img src={this.state.nextWord} alt={this.state.desc}/>
        <span className='word-to-guess'>{this.state.nextWord}</span>

        <p>Your total score is: {this.state.totalScore}</p>

        <form className='quess'>
          <label htmlFor='learn-guess-input'>What's the translation for this word?</label>
          <input required id='learn-guess-input' className='learn-guess-input' type='text'></input>
          <Button type='submit'>Submit your answer</Button>
        </form>
        <p className='word-stats'>You have answered this word correctly {this.state.correctScore} times.</p>
        <p className='word-stats'>You have answered this word incorrectly {this.state.incorrectScore} times.</p>
      </section>
    );
  }
}

export default LearningRoute

import React, { Component } from 'react'

import './DashboardRoute.css'
import config from '../../config'
import TokenService from '../../services/token-service'
import { Link } from 'react-router-dom'
import Button from '../../components/Button/Button'
import UserContext from '../../contexts/UserContext'



class DashboardRoute extends Component {
  static contextType = UserContext

  state = {
    language: {},
    words: []
  }

  componentDidMount = () => {
    fetch(`${config.API_ENDPOINT}/language`, {
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
        language: data.language,
        words: data.words 
      })
    })
    .then(() => {
      this.context.setLanguage({...this.state.language})
    })
    .catch(err =>{
      console.log(err)
    })
  }

  render() {
    return (
        <section>
          <h2>{this.state.language.name}</h2>
          <h2 className='total-correct'>Total correct answers: {this.state.language.total_score}</h2>
          <Link to='/learn'>
            <Button type='button'>Start Practice</Button>
          </Link>
          <h3 className='subtitle'>Words to practice</h3>
          <ul className='word-list'>
          {this.state.words.map(word => {
            return (
              <li className='Card' key={word.id}>
                <img src={word.original} alt={word.description}/>
                <p>{word.correct_count} Correct, {word.incorrect_count} Incorrect</p>
              </li>)
          })}
        </ul>
      </section>
    );
  }
}

export default DashboardRoute
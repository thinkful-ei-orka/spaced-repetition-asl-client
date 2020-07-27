import React, { Component } from 'react'

class DashboardRoute extends Component {
  render() {
    return (
      <div>
        <section>
          <h2>American Sign Language</h2>
          <button>Start Practice</button>
        </section>
        <section>
          Total Score: __ Correct
          <div className='Card'>
            <div>image here</div>
            0 Correct, 0 Incorrect
          </div>
        </section>
      </div>
    );
  }
}

export default DashboardRoute

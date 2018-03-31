import React from 'react';
import { Button } from 'reactstrap';
import './notification.css';

class Notification extends React.Component {

  constructor(props) {
    super(props);

    this.closeNotification = this.closeNotification.bind(this);

    this.state = {
      showNotification: false,
    };
  }

  closeNotification() {
    this.setState({
      showNotification: false,
    });
    localStorage.setItem('notification', 'closed');
  }

  showNotification() {
    return localStorage.getItem('notification') !== 'closed';
  }

  componentDidMount() {
    if (this.showNotification() === false) {
      return;
    }

    setTimeout(() => {
      this.setState({
        showNotification: true,
      });
    }, 15000);
  }

  render() {
    if (this.showNotification() === false) {
      return '';
    }

    return (
      <div className={(this.state.showNotification ? 'active' : '' ) + ' alert position-absolute notification'}>
        <Button className="close" onClick={this.closeNotification}>
          <span aria-hidden="true">&times;</span>
        </Button>

        Vēlies saņemt paziņojumu e-pastā par jauniem datiem? <a href="http://eepurl.com/dpYH4r" target="_blank" rel="noopener noreferrer">Klikšķini te</a>
      </div>
    );
  }

}

export default Notification;

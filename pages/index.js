import { Component } from 'react';
import BirthdayForm from '../components/BirthdayForm';

const API_KEY = 'ivEvwXopKYqbqlNPay5FYP2qeJLZ1gAfKOZ0vQKI'

class Home extends Component {
  constructor() {
    super();  

    this.state = {
      loading: false,
      errors: '',
      images: null,
      month: '',
      day: '',
      foundActualBearthday: true,
      foundImageDate: ''
    }
  }

  handleChange = (e) => {
    const target = e.target;

    switch(target.name) {
      case 'month':
        if (Number.isNaN(Number(target.value)) || Number(target.value) > 12) {
          return this.setState({
            errors: 'Please enter a valid month.'
          });
        }
      case 'day':
        if (Number.isNaN(Number(target.value)) || Number(target.value) > 31) {
          return this.setState({
            errors: 'Please enter a valid day.'
          });
        }
      default:
        this.setState(() => {      
          return {
            [target.name]: target.value,
            errors: '',
            images: null
          }
        });
    }
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { month, day } = this.state;
      const birthdayString = `${ this.lastBirthdayYear(month, day) }-${ this.padDate(month) }-${ this.padDate(day) }`;
      const closestDateString = await this.getValidDate(birthdayString);

      this.setState({
        loading: true
      });

      const nasaData = await this.fetchNasaImages(closestDateString);

      if (nasaData.length === 0) {
        throw new Error('No images found.');
      }

      this.setState({
        loading: false,
        images: nasaData,
        foundImageDate: closestDateString,
        foundActualBearthday: birthdayString === closestDateString
      });

    } catch (error) {
      this.setState({
        loading: false,
        images: null,
        errors: error.message
      });
    }
  }

  async getValidDate(dateString) {
    try {
      const nasaDateRes = await fetch(`https://epic.gsfc.nasa.gov/api/natural/available?api_key=${API_KEY}`);
      const nasaDateData = await nasaDateRes.json();

      if (nasaDateData.error) {
        throw new Error(nasaData.error.message);
      }

      if (!nasaDateData.includes(dateString)) {
        return this.findClosestDate(dateString, nasaDateData);
      }

      return dateString;

    } catch(error) {
      this.setState({
        loading: false,
        images: null,
        errors: error.message
      });
    }
  }

  async fetchNasaImages(dateString) {
    try {
      const nasaRes = await fetch(`https://api.nasa.gov/EPIC/api/images.php?date=${ dateString }&api_key=${API_KEY}`);
      const nasaData = await nasaRes.json();

      if (nasaData.error) {
        throw new Error(nasaData.error.message);
      }

      return nasaData;

    } catch(error) {
      this.setState({
        loading: false,
        images: null,
        errors: error.message
      });
    }
  }

  findClosestDate(dateString, datesArray) {
    const birthdayArray = dateString.split('-');

    for (let i = datesArray.length - 1; i >= 0; i--) {
      let latestAvailable = datesArray[i].split('-');
      dateString = i < datesArray.length - 1 ? datesArray[i + 1] : datesArray[i];

      if (
          (
            Number(latestAvailable[1]) === Number(birthdayArray[1]) && 
            Number(latestAvailable[2]) < Number(birthdayArray[2])
          ) ||
          (
            Number(latestAvailable[1]) < Number(birthdayArray[1]) || 
            Number(latestAvailable[0]) < Number(birthdayArray[0])
          )
        ) {
          return dateString;
        }
    }
  }

  lastBirthdayYear(month, day) {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    if (month > currentMonth || (month === currentMonth && day >= currentDay)) {
      return currentYear - 1;
    }

    return currentYear;
  }

  padDate(number) {
    if (number !== '' && Number(number) < 10 && number.length < 2) {
      return `0${number}`;
    }

    return number;
  }

  render() {
    const { loading, images, month, day, foundImageDate, foundActualBearthday, errors } = this.state;

    return (
      <div className="bearthdayImage">
        <h1 className="bearthdayImage__title">Find Your Bearthday Image!</h1>
        <BirthdayForm 
          month={ month }
          day={ day }
          loading={ loading }
          errors={ errors }
          handleChange={ this.handleChange }
          handleSubmit={ this.handleSubmit }
        />
        <div>
          <span className="bearthdayImage__lastBirthday">
            {month && day &&
              `Your Last Birthday: ${ this.padDate(month) }/${ this.padDate(day) }/${ this.lastBirthdayYear(month, day) }`
            }
          </span>
          {images &&
            <span className="bearthdayImage__foundDate">
              {foundActualBearthday ? 
                'Yay NASA took a photo on your actual bearthday!' :
                `So NASA didn't catch you on your bearthday but ${ foundImageDate } is pretty close.`
              }
            </span>
          }
        </div>
        <div>
          {images &&
            <img src={ `https://epic.gsfc.nasa.gov/archive/natural/${ foundImageDate.replace(/-/g, '/') }/png/${ images[0].image }.png` } />
          }
        </div>
        <style jsx>{`
          h1 {
            margin-top: 2rem;
            margin-bottom: 4rem;
            text-align: center;
          }

          .bearthdayImage__lastBirthday,
          .bearthdayImage__foundDate {
            display: block;
            width: 100%;
            max-width: 40rem;
            margin: 1rem auto;
          }

          img {
            display: block;
            width: 100%;
            max-width: 40rem;
            margin: 0 auto;
          }
        `}</style>
      </div>
    );
  }
  
}

export default Home;
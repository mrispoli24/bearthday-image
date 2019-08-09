const BirthdayForm = (props) => {
  const { 
    loading, 
    errors, 
    month, 
    day, 
    handleSubmit, 
    handleChange 
  } = props;

  return (
    <form 
      className="BirthdayForm" 
      onSubmit={ handleSubmit }
    >
      <fieldset>
        <legend>Enter your birthday below...</legend>
        <div className="BirthdayForm__inputWrap">
          <div className="BirthdayForm__inputGroup">
            <label>Month:</label>
            <input 
              type="text" 
              name="month"
              maxLength="2" 
              placeholder="MM"
              required={ true }
              value={ month }
              onChange={ handleChange }
            />
          </div>
          <div className="BirthdayForm__inputGroup">
            <label>Day:</label>
            <input 
              type="text" 
              name="day"
              maxLength="2" 
              placeholder="DD"
              required={ true }
              value={ day }
              onChange={ handleChange }
            />
          </div>
        </div>
        <input 
          type="submit" 
          value={ loading ? 'Loading...' : 'Submit' }
        />
      </fieldset>
      <span className="BirthdayForm__errors">
        { errors }
      </span>
      <style jsx>{`
        form {
          width: 100%;
          max-width: 40rem;
          margin: 0 auto; 
        }

        fieldset {
          padding: 2rem;
        }

        legend {
          padding: 0 1rem;
          font-size: 1.25rem;
        }

        .BirthdayForm__inputWrap {
          display: flex;
          justify-content: space-between
        }

        .BirthdayForm__inputGroup {
          width: 48%;
          padding: 0.5rem 0;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
        }

        input {
          display: block;
          width: 100%;
          box-sizing: border-box;
        }

        input[type="text"] {
          padding: 1rem;
        }

        input[type="submit"] {
          display: block;
          width: 100%;
          padding: 1rem;
          margin-top: 1rem;
          border: 1px solid #000;
          font-size: 1rem;
          cursor: pointer;
        }
      `}</style>
    </form>
  );
}

export default BirthdayForm;
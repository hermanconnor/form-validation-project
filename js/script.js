'use strict';

const initApp = () => {
  const form = document.querySelector('form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const jobRole = document.getElementById('title');
  const otherJobRoleInput = document.getElementById('other-job-role');
  const design = document.getElementById('design');
  const shirtColor = document.getElementById('color');
  const activities = document.getElementById('activities');
  const checkboxes = document.querySelectorAll('[type=checkbox]');
  const checkboxesContainer = document.getElementById('activities-box');
  const total = document.getElementById('activities-cost');
  const cardInput = document.getElementById('cc-num');
  const zipInput = document.getElementById('zip');
  const cvvInput = document.getElementById('cvv');
  const payment = document.getElementById('payment');
  const paymentMethods = {
    'credit-card': document.getElementById('credit-card'),
    paypal: document.getElementById('paypal'),
    bitcoin: document.getElementById('bitcoin'),
  };

  let totalCost = 0;

  nameInput.focus();

  otherJobRoleInput.style.display = 'none';
  color.disabled = true;

  payment.value = 'credit-card';

  Object.values(paymentMethods).forEach(
    (method) => (method.style.display = 'none'),
  );

  paymentMethods['credit-card'].style.display = 'block';

  function selectShirtColor() {
    shirtColor.disabled = design.value === '';

    [...shirtColor.children].forEach((option) => {
      option.hidden = option.getAttribute('data-theme') !== design.value;

      if (!option.hidden) {
        option.selected = true;
      }
    });
  }

  function showOtherJobRole(e) {
    otherJobRoleInput.style.display =
      e.target.value === 'other' ? 'block' : 'none';
  }

  function activitiesCost(e) {
    const eventCost = parseInt(e.target.getAttribute('data-cost')) || 0;
    totalCost += e.target.checked ? eventCost : -eventCost;
    total.textContent = `Total: $${totalCost}`;
  }

  function activitiesSelector(e) {
    const clicked = e.target;
    const clickedType = clicked.getAttribute('data-day-and-time');

    const sameTypeCheckboxes = Array.from(checkboxes).filter(
      (checkbox) => checkbox.getAttribute('data-day-and-time') === clickedType,
    );
    sameTypeCheckboxes.forEach((checkbox) => {
      if (clicked !== checkbox) {
        checkbox.disabled = clicked.checked;
        checkbox.parentElement.classList.toggle('disabled', checkbox.disabled);
      }
    });
  }

  function activitiesValidator() {
    const isValid = Array.from(checkboxes).some((checkbox) => checkbox.checked);

    activities.classList.toggle('valid', isValid);
    activities.classList.toggle('not-valid', !isValid);
    activities.lastElementChild.style.display = isValid ? 'none' : 'block';

    return isValid;
  }

  function selectPayment() {
    Object.entries(paymentMethods).forEach(([key, method]) => {
      method.style.display = key === payment.value ? 'block' : 'none';
    });
  }

  function setValidationState(input, isValid, message = '') {
    const parent = input.parentElement;
    const msgEl = input.nextElementSibling;
    parent.classList.toggle('valid', isValid);
    parent.classList.toggle('not-valid', !isValid);
    msgEl.style.display = isValid ? 'none' : 'block';
    msgEl.textContent = message || (isValid ? '' : 'This field is required');
  }

  function validateField(input, regex, errorMessage) {
    const value = input.value.trim();
    const isValid = regex.test(value);

    if (value === '') {
      setValidationState(input, isValid, 'This field is required');
      return false;
    }

    if (!isValid) {
      setValidationState(input, isValid, errorMessage);
      return false;
    }
    setValidationState(input, isValid);

    return true;
  }

  function nameValidator(input) {
    return validateField(
      input,
      /^[a-zA-Z]+ ?[a-zA-Z]*? ?[a-zA-Z]*$/,
      'Only letters and spaces allowed',
    );
  }

  function emailValidator(input) {
    return validateField(
      input,
      /^[^@]+@[^@.]+\.[a-z]+$/i,
      'Email address must be formatted correctly (e.g., name@name.com)',
    );
  }

  function cardValidator(input) {
    return validateField(
      input,
      /^\d{13,16}$/,
      'Credit card number must be between 13 - 16 digits',
    );
  }

  function zipValidator(input) {
    return validateField(input, /^\d{5}$/, 'Zip Code must be 5 digits');
  }

  function cvvValidator(input) {
    return validateField(input, /^\d{3}$/, 'CVV must be 3 digits');
  }

  function submitForm(e) {
    e.preventDefault();

    const isNameValid = nameValidator(nameInput);
    const isEmailValid = emailValidator(emailInput);
    const isActivitiesValid = activitiesValidator();

    let isPaymentValid = true;
    if (payment.value === 'credit-card') {
      isPaymentValid =
        cardValidator(cardInput) &&
        zipValidator(zipInput) &&
        cvvValidator(cvvInput);
    }

    if (isNameValid && isEmailValid && isActivitiesValid && isPaymentValid) {
      console.log('Registration successful!');
    } else {
      console.log('Form contains errors. Please check the fields.');
    }
  }

  function handleCheckboxFocus(e) {
    if (e.target.matches('[type=checkbox]')) {
      e.target.parentElement.classList.toggle('focus', e.type === 'focusin');
    }
  }

  // EVENT LISTENERS
  nameInput.addEventListener('keyup', () => nameValidator(nameInput));
  emailInput.addEventListener('keyup', () => emailValidator(emailInput));
  cardInput.addEventListener('keyup', () => cardValidator(cardInput));
  zipInput.addEventListener('keyup', () => zipValidator(zipInput));
  cvvInput.addEventListener('keyup', () => cvvValidator(cvvInput));
  design.addEventListener('change', selectShirtColor);
  jobRole.addEventListener('change', showOtherJobRole);
  activities.addEventListener('change', (e) => {
    activitiesCost(e);
    activitiesSelector(e);
    activitiesValidator();
  });

  checkboxesContainer.addEventListener('focusin', handleCheckboxFocus);
  checkboxesContainer.addEventListener('focusout', handleCheckboxFocus);
  payment.addEventListener('change', selectPayment);
  form.addEventListener('submit', submitForm);
};

document.addEventListener('DOMContentLoaded', initApp);

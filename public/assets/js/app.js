document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    btn.style.boxShadow = '0 0 25px #ff008c';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.boxShadow = '0 0 10px #ff008c';
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focus');
    });
    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('focus');
    });
  });
});

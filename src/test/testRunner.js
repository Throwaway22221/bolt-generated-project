const test = (name, testFn) => {
  try {
    testFn();
    console.log(`%c[Test] %c${name} %cPASSED`, 'color: gray', 'color: blue', 'color: green');
  } catch (error) {
    console.error(`%c[Test] %c${name} %cFAILED`, 'color: gray', 'color: blue', 'color: red');
    console.error(error);
  }
};

export default test;

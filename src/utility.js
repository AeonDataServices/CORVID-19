export let Util = {
  /*
   * Expects a size input string from css, for example "0px"
   * Removes the "px" and converts it to an int
   * If number can't be converted to an int, return -1
   */
  pxToInt(pixelString) {
    let newString = pixelString.replace('px', '')
    let newInt = parseInt(pixelString)
    return (Number.isInteger(newInt)) ? newInt : -1
  }
}

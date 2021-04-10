interface CustomDimensions {
  margin: {
    top: Number;
    right: Number;
    bottom: Number;
    left: Number;
  };
  width: Number;
  height: Number;
}
interface Dimensions {
  margin: {
    top: Number;
    right: Number;
    bottom: Number;
    left: Number;
  };
  width: Number;
  height: Number;
  boundedWidth: Number;
  boundedHeight: number;
}

export { CustomDimensions, Dimensions };

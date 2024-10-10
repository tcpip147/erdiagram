export default (props: { isVisible: boolean }) => {
  return <div style={{ display: props.isVisible ? '' : 'none' }}>File</div>;
};

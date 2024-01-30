const paths = {
  home() {
    return '/'; // libraryview
  },
  barrelShow(id : string) {
    return `/barrels/${id}`;
  },
  barrelEdit(barrelId : string) {
    return `/barrels/edit/${barrelId}`;
  },
  barrelCreate(){
    return `/barrels/new`;
  }
}

export default paths;
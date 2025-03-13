const paths = {
  home() {
    return '/'; // libraryview
  },
  barrelShow(id : string) {
    return `/${id}`;
  },
  barrelEdit(barrelId : string) {
    return `/edit/${barrelId}`;
  },
  barrelCreate(){
    return `/new`;
  },
  export(){
    return '/api/barrels/export'
  }
}

export default paths;
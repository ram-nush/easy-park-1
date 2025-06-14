import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#79badd',
  },
  first_pane: {
    marginTop: 67,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 2,
    backgroundColor: '#ffffff',
  },
  pane: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 2,
    backgroundColor: '#ffffff',
    borderColor: '#000000',
  },
  toggle_button_container: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-end',
  },

  big_font: {
    width: '100%',
    fontSize: 32,
    padding: 9,
    textAlign: 'center',
    fontFamily: 'Raleway_400Regular',
  },
  middle_font: {
    width: '100%',
    fontSize: 28,
    paddingHorizontal: 10,
    fontFamily: 'NunitoSans_300Light',
  },
  small_font: {
    width: '100%',
    fontSize: 20,
    paddingHorizontal: 10,
    fontFamily: 'NunitoSans_300Light',
  },

  list: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 2,
    backgroundColor: '#eeeeee',
  },
  search_pane: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'between',
  },
  search_field: {
    width: '95%',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#333333',
    padding: 10,
    margin: 10,
  },
  button_field: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#333333',
    padding: 2,
    backgroundColor: '#79badd',
  },
  circular_button: {
    width: '100%',
    borderRadius: '50%',
    borderWidth: 2,
    alignSelf: 'flex-end',
    borderColor: '#333333',
    padding: 2,
    backgroundColor: '#79badd',
  },
});

export default styles;
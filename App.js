import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import database from '@react-native-firebase/database';
import RBSheet from "react-native-raw-bottom-sheet";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: {},
      foodvalue: [],
      sportsvalue: [],
      travelvalue: [],
      visible: true,
      searchingData: [
        {
          value: "chawal"
        },
        {
          value: "dosa"
        },
        {
          value: "roti"
        },
        {
          value: "daal"
        },
        {
          value: "sabzi"
        },
        {
          value: "basketball"
        },
        {
          value: "cricket"
        },
        {
          value: "volleyball"
        },
        {
          value: "mount abu"
        },
        {
          value: "srinagar"
        },
        {
          value: "jaipur"
        },
        {
          value: "jhodhpur"
        },
        {
          value: "mohali"
        },
      ],
      searchedData: []
    };
  }

  // getting data from firebase and store in our local state variable ,for storing data we are using 
  // the realtime database of firebase

  componentDidMount() {
    const reference = database().ref(`/`);
    reference.on('value', snapshot => {
      console.log(snapshot.val())
      this.setState({
        name: snapshot.val(),
        visible: false
      })
    });
  }

  // this the logic behind the the searching of items from our state

  filter(item) {
    if (this.state.searchedData.includes(item)) {
      setTimeout(() => {
        this.setState({
          visible: false
        })
      }, 1000)
      return;
    }
    else {
      this.state.searchedData.push(item)
      for (var key in this.state.name) {
        var food = this.state.name[key].Food;
        var sports = this.state.name[key].Sports;
        var travel = this.state.name[key].Travel;
        var foodValue = item in food;
        if (foodValue) {
          this.state.foodvalue.push(key)
        }
        var sportsValue = item in sports;
        if (sportsValue) {
          this.state.sportsvalue.push(key)
        }
        var travelValue = item in travel;
        if (travelValue) {
          this.state.travelvalue.push(key)
        }
      }
    }
    setTimeout(() => {
      this.setState({
        visible: false
      })
      this.forceUpdate()
    }, 3000)
  }

  // In this method we are removing all data

  reset() {
    this.state.foodvalue.length = 0;
    this.state.sportsvalue.length = 0;
    this.state.travelvalue.length = 0;
    this.state.searchedData.length = 0
    this.RBSheet.close()
    this.forceUpdate()
  }


  render() {
    return (
      <View>
        <RBSheet
          ref={ref => {
            this.RBSheet = ref;
          }}
          height={300}
          openDuration={250}
          customStyles={{
            container: {
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15
            }
          }}
        >
          <View style={style.flexProperty}>
            <FlatList
              data={this.state.searchingData}
              numColumns={4}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[style.flexProperty,]}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity style={{ backgroundColor: this.state.searchedData.includes(item.value) == true ? "#E59898" : '', flex: 1 }} onPress={() => {
                    this.filter(item.value)
                    this.RBSheet.close()
                    this.setState({
                      visible: true
                    })
                  }}>
                    <Text style={{ padding: 10, textAlign: 'center', color: 'black' }}>{item.value}</Text>
                  </TouchableOpacity>
                )
              }}
            ></FlatList>
            <TouchableOpacity style={[style.themeColor, { width: "100%", alignItems: 'center', borderRadius: 15 }]} onPress={() => {
              this.reset()
            }}>
              <Text style={[style.headerTextProps, { padding: 10 }]}>Reset</Text>
            </TouchableOpacity>
          </View>
        </RBSheet>
        <View style={[style.themeColor, style.headerView]}>
          <Text style={style.headerTextProps}>Assignment</Text>
          {this.state.visible == false &&
            <TouchableOpacity onPress={() => this.RBSheet.open()}>
              <Text style={style.headerTextProps}>filter</Text>
            </TouchableOpacity>
          }
        </View>
        {this.state.visible == true ?
          <ActivityIndicator></ActivityIndicator>
          :
          <View style={style.headerView}>
            <View>
              <Text style={style.titleProps}>Food</Text>
              {this.state.foodvalue.map((item, index) => {
                return (
                  <Text>{index + 1}) {item}</Text>
                )
              })}
            </View>
            {console.log(this.state.foodvalue)}
            <View>
              <Text style={style.titleProps}>Sports</Text>
              {this.state.sportsvalue.map((item, index) => {
                return (
                  <Text>{index + 1}) {item}</Text>
                )
              })}
            </View>
            <View>
              <Text style={style.titleProps}>Travel</Text>
              {this.state.travelvalue.map((item, index) => {
                return (
                  <Text>{index + 1}) {item}</Text>
                )
              })}
            </View>
          </View>}
      </View>
    );
  }
}

const style = StyleSheet.create({
  themeColor: {
    backgroundColor: "#E59898"
  },
  flexProperty: {
    flex: 1
  },
  headerTextProps: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#CC3232'
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10
  },
  titleProps: {
    fontSize: 25,
    fontWeight: 'bold'
  }
})


// this is my databse in firebase:-
// {"Kabir": {"Food": {"chawal": "chawal", "dosa": "dosa", "roti": "roti"}, "Sports": {"basketball": "basketball", "cricket": "cricket"}, 
// "Travel": {"mount abu": "mountabu", "srinagar": "srinagar"}}, "Rahul": {"Food": {"daal": "daal"}, 
// "Sports": {"basketball": "basketball", "football": "football"}, "Travel": {"srinagar": "srinagar"}}, 
// "Rohit": {"Food": {"daal": "daal", "roti": "roti", "sabzi": "sabzi"},
//  "Sports": {"basketball": "basketball", "cricket": "cricket", "volleyball": "volleyball"}, 
//  "Travel": {"jaipur": "jaipur", "jhodhpur": "jhodhpur", "mohali": "mohali"}}, 
//  "Salman Khan": {"Food": {"daal": "daal", "roti": "roti", "sabzi": "sabzi"}, 
//  "Sports": {"basketball": "basketball", "cricket": "cricket", "volleyball": "volleyball"}, 
//  "Travel": {"jaipur": "jaipur", "jhodhpur": "jhodhpur", "mohali": "mohali"}}}


import {View, Text as TextR, Alert, StyleSheet, Button, Image, ScrollView, FlatList,TouchableOpacity} from 'react-native'
import React, {Component} from 'react'
import PropTypes from 'prop-types';
import { LineChart, Grid, ProgressCircle, PieChart } from 'react-native-svg-charts'
import * as shape from 'd3-shape'
import { Circle, G, Line, Rect, Text} from 'react-native-svg'


const mois = [ 50, 10, 40, 95, 4, 5, 85, 91, 35, 53, 50, 10, 40, 95, 4, -24, 85, 91, 35, 53, 50, 10, 40, 95, 4, 24, 85, 91, 35, 53]

const semaine = [ 50, 10, 40, 95, 4, 24, 85]

const piechartdata = [
            {
                key: 1,
                amount: 50,
                svg: { fill: '#600080' },
            },
            {
                key: 2,
                amount: 50,
                svg: { fill: '#9900cc' }
            },
            {
                key: 3,
                amount: 40,
                svg: { fill: '#c61aff' }
            },
            {
                key: 4,
                amount: 95,
                svg: { fill: '#d966ff' }
            },
            {
                key: 5,
                amount: 35,
                svg: { fill: '#ecb3ff' }
            },
            {
                key: 6,
                amount: 95,
                svg: { fill: '#d966ff' }
            },
            {
                key: 7,
                amount: 95,
                svg: { fill: '#d966ff' }
            }
]


class MyListItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };

  render() {
    const backColor = this.props.selected ? "red" : "gray";
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View style = {{backgroundColor : backColor, flex :1, flexDirection :'row'}}>
          {parseInt(this.props.id) > 0 ?
          <Image style={{width: 50, height: 50}} source = {require('./images/Pie.png')}/> :
        <Image style={{width: 50, height: 50}} source = {require('./images/Line.png')}/>}
        <TextR style = {{width:100}}>
          {this.props.title}
        </TextR>
        </View>
      </TouchableOpacity>
    );
  }
}

class MultiSelectList extends React.PureComponent {
  state = {selected: (new Map(): Map<string, boolean>)};

  _keyExtractor = (item, index) => item.id;

  _onPressItem = (id: string) => {
    // updater functions are preferred for transactional updates
    this.setState((state) => {
      // copy the map rather than modifying state.
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id)); // toggle
      return {selected};
    });
  };

  _renderItem = ({item}) => (
    <MyListItem
      id={item.id}
      onPressItem={this._onPressItem}
      selected={!!this.state.selected.get(item.id)}
      title={item.title}
    />
  );

  render() {
    return (
      <View style = {{marginTop :20, height : 80}}>
      <FlatList
        horizontal = {true}
        data={this.props.data}
        extraData={this.state}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
      </View>
    );
  }
}

export default class AnalyticsScreen extends Component {
  static propTypes = {
  }

  static defaultProps = {
  };

  static navigationOptions = {
  }

  constructor(props){
    super(props)
    this.state = {donnees: mois}
  }

  _changeWeek(){
    this.setState({ donnees : semaine })}

  _changeMonth(){
    this.setState({ donnees : mois })}

  UNSAFE_componentWillMount() {
  }

  render() {

    const HorizontalLine = (({ y }) => (
        <Line
            key={ 'zero-axis' }
            x1={ '0%' }
            x2={ '100%' }
            y1={ y(50) }
            y2={ y(50) }
            stroke={ 'grey' }
            strokeDasharray={ [ 4, 8 ] }
            strokeWidth={ 2 }
        />
    ))

// Legende du graphique
    const Tooltip = ({ x, y }) => (
        <G
            x={ x(5) - (100 / 2) }
            key={ 'tooltip' }
            onPress={ () => console.log('tooltip clicked') }
        >
            <G y={ 50 }>
                <Rect
                    height={ 40 }
                    width={ 100 }
                    stroke={ 'grey' }
                    fill={ 'white' }
                    ry={ 10 }
                    rx={ 10 }
                />
                <Text
                    x={ 100 / 2 }
                    dy={ 20 }
                    alignmentBaseline={ 'middle' }
                    textAnchor={ 'middle' }
                    stroke={ 'rgb(134, 65, 244)' }
                >
                    { `${this.state.donnees[5]}ºC` }
                </Text>
            </G>
            <G x={ 100 / 2 }>
                <Line
                    y1={ 50 + 40 }
                    y2={ y(this.state.donnees[ 5 ]) }
                    stroke={ 'grey' }
                    strokeWidth={ 2 }
                />
                <Circle
                    cy={ y(this.state.donnees[ 5 ]) }
                    r={ 6 }
                    stroke={ 'rgb(134, 65, 244)' }
                    strokeWidth={ 2 }
                    fill={ 'white' }
                />
            </G>
        </G>
    )

    const randomColor = () => ('#' + (Math.random() * 0xFFFFFF << 0).toString(16) + '000000').slice(0, 7)

    const Labels = ({ slices, height, width }) => {
        return slices.map((slice, index) => {
            const { labelCentroid, pieCentroid, piechartdata } = slice;
            return (
                <G
                    key={index}
                    x={labelCentroid[ 0 ]}
                    y={labelCentroid[ 1 ]}
                >
                    <Circle
                        r={18}
                        fill={'white'}
                    />
                    <Text
                    x={5}
                    y={5}>{index}</Text>
                </G>
            )
        })
      }
    const GraphId = 5

//graphique
    return (
      <View style={{flex:1}}>
      <ScrollView style = {{flex:3}}>
      <MultiSelectList data = {[{id:'0', title:"Nombre d'inscription dans le mois?"},{id:'1', title:'Graphique 2'},{id:'2', title:'Graphique 3'},{id:'3', title:'Graphique 4'}]}/>
        {GraphId < 0 ?
          <View style={{flex:1}}>
          <LineChart
            style={{ height: 200 }}
            data={ this.state.donnees }
            svg={{
                stroke: 'rgb(134, 65, 244)',
                strokeWidth: 2,
            }}
            contentInset={{ top: 20, bottom: 20 }}
            curve={ shape.curveLinear }
            animate={true}>
            <Grid/>
            <HorizontalLine/>
            <Tooltip/>
        </LineChart>
        <View style = {{flex:1, flexDirection : 'row', justifyContent: 'center', alignItems: 'center'}}>
          <Button
            style={{height : 50}}
            title="Semaine"
            onPress={() => this._changeWeek()}/>
          <Button
            style={{height : 50}}
            title="Mois"
            onPress={() => this._changeMonth()}/>
        </View>
        </View> :
        <PieChart
          style={{ height: 300 }}
          valueAccessor={({ item }) => item.amount}
          data={piechartdata}
          spacing={0}
          outerRadius={'95%'}>
        <Labels/>
        </PieChart>}
      </ScrollView>
      </View>
    )
}

}

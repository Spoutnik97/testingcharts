import {
  View, Text as TextR, Alert, StyleSheet, Button, Image, ScrollView, FlatList, TouchableOpacity,
} from 'react-native';
import React, { Component } from 'react';
import {
  LineChart, Grid, ProgressCircle, PieChart, YAxis, XAxis,
} from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import {
  Circle, G, Line, Rect, Text,
} from 'react-native-svg';

const mois = [50, 10, 40, 95, 4, 5, 85, 91, 35, 53, 50, 10, 40, 95, 4, 85, 91, 35, 53, 50, 10, 40, 95, 4, 24, 85, 91, 35, 53];

const semaine = [50, 10, 40, 95, 4, 24, 85];

const menu = [{ id: 0, title: "Nombre d'inscription" }, { id: 1, title: 'Graphique 2' }, { id: 2, title: 'Graphique 3' }, { id: 3, title: 'Graphique 4' }];

const data = [42, 67, 30, 97, 37, 103];
export default class AnalyticsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      donnees: mois,
      graphId: 0,
      active: 0,
      colors: this.makeColors(),
    };
  }

  randomColor = () => ('#' + (Math.random() * 0xFFFFFF << 0).toString(16) + '000000').slice(0, 7);

  makeColors = () => {
    const t = [];
    for (let i = 0; i < 10; i++) {
      t.push(this.randomColor());
    }
    return (t);
  };


  _changeWeek() {
    this.setState({ donnees: semaine });
  }

  _changeMonth() {
    this.setState({ donnees: mois });
  }

  componenDidMount() {
    const pieData = data
      .filter(value => value > 0)
      .map((value, index) => ({
        value,
        svg: {
          fill: this.state.colors[index],
          onPress: () => this.setState({ pieActive: index }),
          arc: this.state.pieActive === index ? { outerRadius: '130%', cornerRadius: 10 } : { outerRadius: '100%', innerRadius: '50%' },
        },
        key: `pie-${index}`,
      }));

    this.setState({ pieData });
  }

  render() {
    const pieData = data
      .filter(value => value > 0)
      .map((value, index) => ({
        value,
        svg: {
          fill: this.state.colors[index],
          onPress: () => this.setState({ pieActive: index }),
          arc: this.state.pieActive === index ? { outerRadius: '130%', cornerRadius: 10 } : { outerRadius: '100%', innerRadius: '50%' },
        },
        key: `pie-${index}`,
      }));

    const HorizontalLine = (({ y }) => (
      <Line
        key="zero-axis"
        x1="0%"
        x2="100%"
        y1={y(50)}
        y2={y(50)}
        stroke="grey"
        strokeDasharray={[4, 8]}
        strokeWidth={2}
      />
    ));

    // Legende du graphique
    const Tooltip = ({ x, y }) => (
      <G
        x={x(5) - (100 / 2)}
        key="tooltip"
        onPress={() => console.log('tooltip clicked')}
      >
        <G y={50}>
          <Rect
            height={40}
            width={100}
            stroke="grey"
            fill="white"
            ry={10}
            rx={10}
          />
          <Text
            x={100 / 2}
            dy={20}
            alignmentBaseline="middle"
            textAnchor="middle"
            stroke="rgb(134, 65, 244)"
          >
            { `${this.state.donnees[5]}ºC` }
          </Text>
        </G>
        <G x={100 / 2}>
          <Line
            y1={50 + 40}
            y2={y(this.state.donnees[5])}
            stroke="grey"
            strokeWidth={2}
          />
          <Circle
            cy={y(this.state.donnees[5])}
            r={6}
            stroke="rgb(134, 65, 244)"
            strokeWidth={2}
            fill="white"
          />
        </G>
      </G>
    );

    const Labels = ({ slices, height, width }) => slices.map((slice, index) => {
      const { labelCentroid, pieCentroid } = slice;
      return (
        <G
          key={labelCentroid}
          x={labelCentroid[0]}
          y={labelCentroid[1]}
        >

          <Circle
            r={18}
            fill="white"
            onPress={() => console.log('Hello')}
          />
          <Text
            x={-7}
            y={7}
          >
            {slice.data.value}
          </Text>
        </G>

      );
    });

    // graphique
    return (
      <View style={{ flex: 1, marginTop: 56 }}>
        <ScrollView style={{ flex: 3 }}>
          <ScrollView horizontal>
            <View style={{ flexDirection: 'row' }}>
              {
              menu.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={{
                    padding: 24, backgroundColor: this.state.active === item.id ? 'red' : 'grey', justifyContent: 'center', alignItems: 'center',
                  }}
                  onPress={() => this.setState({ graphId: item.id, active: item.id })}
                >
                  <TextR>{item.title}</TextR>
                </TouchableOpacity>
              ))
            }
            </View>
          </ScrollView>
          {this.state.graphId === 0 ? (
            <View>
              <View style={{ height: 300, flexDirection: 'row', padding: 20 }}>
                <YAxis
                  data={this.state.donnees}
                  svg={{
                    fill: 'grey',
                    fontSize: 10,
                  }}
                  contentInset={{ top: 10, bottom: 40 }}
                  formatLabel={value => `${value}`}
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <LineChart
                    style={{ flex: 1 }}
                    data={this.state.donnees}
                    contentInset={{ top: 10, bottom: 10 }}
                    svg={{
                      stroke: 'rgb(134, 65, 244)',
                      strokeWidth: 2,
                    }}
                    curve={shape.curveNatural}
                    // curve={shape.curveLinear}
                  >
                    <Grid />
                    <HorizontalLine />
                    {/* <Tooltip /> */}
                  </LineChart>
                  <XAxis
                    style={{ marginHorizontal: -10, height: 30 }}
                    data={this.state.donnees}
                    formatLabel={(value, index) => (index % 5 === 0 ? index : null)}
                    contentInset={{ left: 10, right: 10 }}
                    svg={{ fontSize: 10, fill: 'grey' }}
                  />
                </View>
              </View>
              <View style={{
                flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
              }}
              >
                <Button
                  style={{ height: 50, margin: 24 }}
                  title="Semaine"
                  onPress={() => this._changeWeek()}
                />
                <Button
                  style={{ height: 50, margin: 24 }}
                  title="Mois"
                  onPress={() => this._changeMonth()}
                />
              </View>
            </View>
          ) : (
            <PieChart
              style={{ height: 300, marginTop: 24 }}
              data={pieData}
              spacing={0}
              outerRadius="100%"
            >
              <Labels />
            </PieChart>
          )
    }
        </ScrollView>
      </View>
    );
  }
}

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../lib/AuthContext';
import { images } from '../../constants';
import { db } from '../../lib/firebase'; 
import {
  collection,
  getDocs
} from 'firebase/firestore';

// For donut chart
import * as d3Shape from 'd3-shape';
import { Svg, G, Path, Text as SvgText } from 'react-native-svg';

// Expo Router
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const Home = () => {
  const { loading, currentUser } = useAuth();
  const router = useRouter();

  const [productsLoading, setProductsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [totalFootprint, setTotalFootprint] = useState(0);

  // Chart animation
  const chartProgress = useRef(new Animated.Value(0)).current;
  const [chartProgressValue, setChartProgressValue] = useState(0);

  // Expandable sections
  const [expandedcategories, setExpandedcategories] = useState({});

  // Slice highlight in donut
  const [selectedSliceIndex, setSelectedSliceIndex] = useState(null);

  // Colors for donut slices
  const sliceColors = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
    '#D3D3D3',
  ];

  /* ------------------------------------------------------------------
   *  1. Check user & fetch products
   * ------------------------------------------------------------------ */
  useEffect(() => {
    if (!loading && !currentUser) {
      router.replace('/');
      return;
    }
    if (!loading && currentUser) {
      fetchProducts();
    }
  }, [loading, currentUser]);

  /* ------------------------------------------------------------------
   *  2. Fetch products from Firestore
   * ------------------------------------------------------------------ */
  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      chartProgress.setValue(0); // reset chart

      const productsRef = collection(db, 'accounts', currentUser.uid, 'products');
      const snapshot = await getDocs(productsRef);

      const fetchedProducts = [];
      let total = 0;

      snapshot.forEach((document) => {
        const data = document.data();

        // parse footprint
        const footprintString = data.footprint || '';
        let footprintValue = 0;
        if (footprintString) {
          const parts = footprintString.split(' ');
          footprintValue = parseFloat(parts[0]) || 0;
        }

        // parse date_dadded or date_added
        let dateDaddedJs = null;
        const dateKey = data.date_dadded || data.date_added;
        if (dateKey && dateKey.toDate) {
          dateDaddedJs = dateKey.toDate();
        } else if (dateKey) {
          dateDaddedJs = new Date(dateKey);
        }

        fetchedProducts.push({
          id: document.id,
          ...data,
          footprintValue,
          date_dadded_js: dateDaddedJs || new Date(0),
        });

        total += footprintValue;
      });

      // sort by newest
      fetchedProducts.sort(
        (a, b) => (b.date_dadded_js?.getTime() || 0) - (a.date_dadded_js?.getTime() || 0)
      );

      setProducts(fetchedProducts);
      setTotalFootprint(total);

      // animate chart
      Animated.timing(chartProgress, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      }).start();

    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  /* ------------------------------------------------------------------
   *  3. Group products by category
   * ------------------------------------------------------------------ */
  const groupProductsByCategory = (sortedProducts) => {
    const tempMap = {};

    // grouped by category
    for (const prod of sortedProducts) {
      const catKey = prod.category || 'Unknown';
      if (!tempMap[catKey]) {
        tempMap[catKey] = [];
      }
      tempMap[catKey].push(prod);
    }

    // create array with newest date
    const groupArray = Object.keys(tempMap).map((catKey) => {
      const prods = tempMap[catKey];
      const newestDate = prods[0].date_dadded_js || new Date(0);
      return { catKey, products: prods, newestDate };
    });

    // sort by newest date desc
    groupArray.sort((a, b) => b.newestDate - a.newestDate);
    return groupArray;
  };

  const categoryGroups = groupProductsByCategory(products);

  /* ------------------------------------------------------------------
   *  4. Data for donut
   * ------------------------------------------------------------------ */
  const dataForPie = categoryGroups.map((group, idx) => {
    const sumValue = group.products.reduce(
      (acc, p) => acc + (p.footprintValue || 0),
      0
    );
    return {
      name: group.catKey,
      value: sumValue,
      color: sliceColors[idx % sliceColors.length],
    };
  });

  // d3 generator
  const pieGenerator = d3Shape
    .pie()
    .value((d) => d.value)
    .sort(null);

  const arcs = pieGenerator(dataForPie);

  /* ------------------------------------------------------------------
   *  5. Expand/collapse
   * ------------------------------------------------------------------ */
  const handleToggleCategory = (catKey) => {
    setExpandedcategories((prev) => ({
      ...prev,
      [catKey]: !prev[catKey],
    }));
  };

  /* ------------------------------------------------------------------
   *  6. Slice press
   * ------------------------------------------------------------------ */
  const handleSlicePress = (index) => {
    if (!dataForPie[index] || totalFootprint === 0) {
      setSelectedSliceIndex(null);
      return;
    }
    setSelectedSliceIndex(index);

    // expand that group
    const catName = dataForPie[index].name;
    setExpandedcategories((prev) => ({
      ...prev,
      [catName]: true,
    }));
  };

  /* ------------------------------------------------------------------
   *  7. Navigate to details
   * ------------------------------------------------------------------ */
  const handleProductPress = (product) => {
    router.push({
      pathname: '/details',
      params: {
        id: product.id,
        product_name: product.product_name,
        category: product.category || '',
        footprint: product.footprint || '',
        additional_info: product.additional_info || '',
        tips: product.tips || '',
        date_added: product.date_added || '',
      },
    });
  };

  /* ------------------------------------------------------------------
   *  8. Animate arcs
   * ------------------------------------------------------------------ */
  useEffect(() => {
    const id = chartProgress.addListener(({ value }) => {
      setChartProgressValue(value);
    });
    return () => {
      chartProgress.removeListener(id);
    };
  }, []);

  /* ------------------------------------------------------------------
   *  9. Render
   * ------------------------------------------------------------------ */
  return (
    <ImageBackground source={images.background} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Home</Text>

        {productsLoading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Donut Chart */}
            {totalFootprint > 0 ? (
              <View style={styles.chartContainer}>
                <View style={styles.svgWrapper}>
                  <View style={styles.donutWrapper}>
                    <Svg width={220} height={220}>
                      <G x={110} y={110}>
                        {arcs.map((arc, index) => {
                          // pop-out effect
                          const outerRadius =
                            index === selectedSliceIndex ? 110 : 100;
                          const arcStartAngle = arc.startAngle;
                          const arcEndAngle = arc.endAngle;

                          // partial arc for animation
                          const currentEndAngle =
                            arcStartAngle +
                            (arcEndAngle - arcStartAngle) * chartProgressValue;

                          const partialArc = {
                            ...arc,
                            endAngle: currentEndAngle,
                          };

                          const arcPath = d3Shape
                            .arc()
                            .outerRadius(outerRadius)
                            .innerRadius(60)(partialArc);

                          return (
                            <G
                              key={`arc-${index}`}
                              onPress={() => handleSlicePress(index)}
                            >
                              <Path d={arcPath} fill={dataForPie[index].color} />
                            </G>
                          );
                        })}
                        {/* Center text */}
                        <SvgText
                          fill="#FFF"
                          fontSize="14"
                          fontWeight="bold"
                          textAnchor="middle"
                          x={0}
                          y={0}
                        >
                          {`${totalFootprint.toFixed(1)}\nkg CO2e`}
                        </SvgText>
                      </G>
                    </Svg>
                  </View>
                </View>

                {/* Legend */}
                <View style={styles.legendContainer}>
                  {dataForPie.map((item, idx) => {
                    const percent = totalFootprint
                      ? (item.value / totalFootprint) * 100
                      : 0;
                    const isSelected = idx === selectedSliceIndex;
                    return (
                      <View style={styles.legendRow} key={`${item.name}-${idx}`}>
                        <View
                          style={[
                            styles.legendColorBox,
                            { backgroundColor: item.color },
                          ]}
                        />
                        <Text
                          style={[
                            styles.legendText,
                            isSelected && styles.legendTextSelected,
                          ]}
                        >
                          {item.name} - {percent.toFixed(1)}%
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            ) : (
              <Text style={styles.noFootprintText}>No footprint data yet.</Text>
            )}

            {/* Category Sections */}
            {categoryGroups.map((group, idx) => {
              const catKey = group.catKey;
              const catProducts = group.products;
              const expanded = !!expandedcategories[catKey];

              return (
                <View key={`${catKey}-${idx}`} style={styles.categorySection}>
                  <TouchableOpacity
                    onPress={() => handleToggleCategory(catKey)}
                    style={styles.catHeader}
                  >
                    <Text style={styles.catHeaderText}>
                      {catKey} ({catProducts.length})
                    </Text>
                    <Ionicons
                      name={expanded ? 'chevron-down' : 'chevron-forward'}
                      size={20}
                      color="#324958" // slightly darker than white for contrast
                    />
                  </TouchableOpacity>

                  {expanded && (
                    <View style={styles.productList}>
                      {catProducts.map((product, pidx) => (
                        <TouchableOpacity
                          key={`${product.id}-${pidx}`}
                          style={styles.productItem}
                          onPress={() => handleProductPress(product)}
                        >
                          <Ionicons
                            name="cube-outline"
                            size={18}
                            color="#324958"
                            style={{ marginRight: 8 }}
                          />
                          <Text style={styles.productItemText}>
                            {product.product_name || 'Unnamed Product'}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Home;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    // No longer aligning items center so we get full width
    // and rely on padding to create ~20px horizontal spacing
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 50,
  },
  title: {
    fontSize: 24,
    paddingTop: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#fff',
  },

  // Chart
  chartContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  svgWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutWrapper: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendContainer: {
    marginTop: 16,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  legendColorBox: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  legendText: {
    color: '#fff',
    fontSize: 14,
  },
  legendTextSelected: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  noFootprintText: {
    fontSize: 16,
    color: '#fff',
    marginVertical: 8,
    textAlign: 'center',
  },

  // Category groups
  categorySection: {
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    // Small shadow/elevation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  catHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  catHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#324958', // darker text for readability
  },
  productList: {
    paddingVertical: 8,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  productItemText: {
    fontSize: 14,
    color: '#324958', // consistent with header color
  },
});

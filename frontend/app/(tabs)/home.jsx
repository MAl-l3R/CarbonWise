import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../lib/AuthContext';
import { images } from '../../constants';
import { db } from '../../lib/firebase'; // Replace with your actual Firebase config import
import {
  collection,
  getDocs,
  deleteDoc,
  doc
} from 'firebase/firestore';

// For donut chart
import * as d3Shape from 'd3-shape';
import { Svg, G, Path, Text as SvgText } from 'react-native-svg';

const Home = () => {
  const { loading, currentUser } = useAuth();

  // Loading states
  const [productsLoading, setProductsLoading] = useState(true);

  // Product / footprint data
  const [products, setProducts] = useState([]);
  const [totalFootprint, setTotalFootprint] = useState(0);

  // Pie chart animation
  const chartProgress = useRef(new Animated.Value(0)).current;
  const [chartProgressValue, setChartProgressValue] = useState(0);

  // For expanding/collapsing each functionality section
  const [expandedFunctionalities, setExpandedFunctionalities] = useState({});

  // For showing detailed product info & deletion
  const [selectedProduct, setSelectedProduct] = useState(null);

  // For highlighting a slice in the donut chart
  const [selectedSliceIndex, setSelectedSliceIndex] = useState(null);

  // Colors for the donut slices
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
   *  1. useEffect: check user & fetch products
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
      // Reset chart progress to 0 so it re-animates on new data
      chartProgress.setValue(0);

      const productsRef = collection(db, 'accounts', currentUser.uid, 'products');
      const snapshot = await getDocs(productsRef);

      const fetchedProducts = [];
      let total = 0;

      snapshot.forEach((document) => {
        const data = document.data();

        // 2.1 Parse footprint (e.g. "150 kg CO2e")
        const footprintString = data?.footprint || '';
        let footprintValue = 0;
        if (footprintString) {
          const parts = footprintString.split(' ');
          footprintValue = parseFloat(parts[0]) || 0;
        }

        // 2.2 Parse date_dadded (assume it's a Firestore Timestamp or a valid date string)
        let dateDaddedJs = null;
        if (data.date_dadded && data.date_dadded.toDate) {
          // Firestore Timestamp
          dateDaddedJs = data.date_dadded.toDate();
        } else if (data.date_dadded) {
          // Possibly a string or numeric
          dateDaddedJs = new Date(data.date_dadded);
        }

        fetchedProducts.push({
          id: document.id,
          ...data,
          footprintValue,
          date_dadded_js: dateDaddedJs || new Date(0), // fallback if missing
        });

        total += footprintValue;
      });

      // 2.3 Sort products by date_dadded_js descending (newest first)
      fetchedProducts.sort(
        (a, b) => (b.date_dadded_js?.getTime() || 0) - (a.date_dadded_js?.getTime() || 0)
      );

      setProducts(fetchedProducts);
      setTotalFootprint(total);

      // Re-run the chart animation
      Animated.timing(chartProgress, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false, // must be false for arc calculations
      }).start();

    } catch (error) {
      console.error('Error fetching product footprints:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  /* ------------------------------------------------------------------
   *  3. Group (already sorted) products by functionality
   * ------------------------------------------------------------------ */
  // We'll store them in a structure preserving the sorted order.
  // Then we can create an array of groups to also sort the functionalities
  // by the date of their newest product.
  const groupProductsByFunctionality = (sortedProducts) => {
    const tempMap = {};

    // Because 'products' is already sorted by date desc, the first item in each group is the newest
    for (const prod of sortedProducts) {
      const funcKey = prod.functionality || 'Unknown';
      if (!tempMap[funcKey]) {
        tempMap[funcKey] = [];
      }
      tempMap[funcKey].push(prod);
    }

    // Now create an array of { funcKey, products[], newestDate }
    const groupArray = Object.keys(tempMap).map((funcKey) => {
      const prods = tempMap[funcKey];
      // prods is already sorted descending
      // the first product is the newest
      const newestDate = prods[0].date_dadded_js || new Date(0);
      return { funcKey, products: prods, newestDate };
    });

    // Sort the array of groups by newestDate descending
    groupArray.sort((a, b) => b.newestDate - a.newestDate);
    return groupArray;
  };

  const functionalityGroups = groupProductsByFunctionality(products);

  /* ------------------------------------------------------------------
   *  4. Prepare data for the donut chart
   * ------------------------------------------------------------------ */
  // We'll sum the footprints in each group to form slices
  const dataForPie = functionalityGroups.map((group, idx) => {
    const sumValue = group.products.reduce(
      (acc, p) => acc + (p.footprintValue || 0),
      0
    );
    return {
      name: group.funcKey,
      value: sumValue,
      color: sliceColors[idx % sliceColors.length],
    };
  });

  // d3 pie generator
  const pieGenerator = d3Shape
    .pie()
    .value((d) => d.value)
    .sort(null);

  const arcs = pieGenerator(dataForPie);

  /* ------------------------------------------------------------------
   *  5. Expand/collapse functionality sections
   * ------------------------------------------------------------------ */
  const handleToggleFunctionality = (funcKey) => {
    setExpandedFunctionalities((prev) => ({
      ...prev,
      [funcKey]: !prev[funcKey],
    }));
  };

  /* ------------------------------------------------------------------
   *  6. Slice press handler (for highlighting & expand section)
   * ------------------------------------------------------------------ */
  const handleSlicePress = (index) => {
    if (!dataForPie[index] || totalFootprint === 0) {
      setSelectedSliceIndex(null);
      return;
    }
    setSelectedSliceIndex(index);

    // Expand the corresponding functionality in the list
    const funcName = dataForPie[index].name;
    setExpandedFunctionalities((prev) => ({
      ...prev,
      [funcName]: true,
    }));
  };

  /* ------------------------------------------------------------------
   *  7. Product press -> open modal
   * ------------------------------------------------------------------ */
  const handleProductPress = (product) => {
    setSelectedProduct(product);
  };

  /* ------------------------------------------------------------------
   *  8. Delete a product
   * ------------------------------------------------------------------ */
  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    try {
      const docRef = doc(
        db,
        'accounts',
        currentUser.uid,
        'products',
        selectedProduct.id
      );
      await deleteDoc(docRef);

      // Close modal
      setSelectedProduct(null);

      // Refresh product list and donut chart
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  /* ------------------------------------------------------------------
   *  9. Listen to chartProgress to animate arcs
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
   *  10. Render
   * ------------------------------------------------------------------ */
  return (
    <ImageBackground source={images.background} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Home</Text>

        {productsLoading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
            {/* Donut Chart */}
            {totalFootprint > 0 ? (
              <View style={styles.chartContainer}>
                <View style={styles.svgWrapper}>
                  <View style={styles.donutWrapper}>
                    <Svg width={220} height={220}>
                      <G x={110} y={110}>
                        {arcs.map((arc, index) => {
                          // pop out effect if slice is selected
                          const outerRadius =
                            index === selectedSliceIndex ? 110 : 100;
                          const arcStartAngle = arc.startAngle;
                          const arcEndAngle = arc.endAngle;
                          // partial arc to animate from 0 -> slice angle
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

                          // Use <G onPress> to ensure Android can detect taps
                          return (
                            <G
                              key={`arc-${index}`}
                              onPress={() => handleSlicePress(index)}
                            >
                              <Path d={arcPath} fill={dataForPie[index].color} />
                            </G>
                          );
                        })}
                        {/* Center text for total footprint */}
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
              <Text style={styles.noFootprintText}>
                No footprint data yet.
              </Text>
            )}

            {/* Functionality Sections (sorted by newest product) */}
            {functionalityGroups.map((group, idx) => {
              const funcKey = group.funcKey;
              const funcProducts = group.products; // Already sorted descending by date
              const expanded = !!expandedFunctionalities[funcKey];
              return (
                <View key={`${funcKey}-${idx}`} style={styles.functionalitySection}>
                  <TouchableOpacity
                    onPress={() => handleToggleFunctionality(funcKey)}
                    style={styles.funcHeader}
                  >
                    <Text style={styles.funcHeaderText}>
                      {funcKey} ({funcProducts.length})
                    </Text>
                    <Text style={styles.expandCollapseText}>
                      {expanded ? '-' : '+'}
                    </Text>
                  </TouchableOpacity>

                  {/* Expand/Collapse List */}
                  {expanded && (
                    <View style={styles.productList}>
                      {funcProducts.map((product, pidx) => (
                        <TouchableOpacity
                          key={`${product.id}-${pidx}`}
                          style={styles.productItem}
                          onPress={() => handleProductPress(product)}
                        >
                          {/* Display product_name instead of name */}
                          <Text style={styles.productItemText}>
                            {product.product_name || 'Unnamed Product'}
                          </Text>
                          {/* Optionally display date here */}
                          {/* <Text style={[styles.productItemText, { fontSize: 12 }]}>
                            {product.date_dadded_js?.toLocaleString() || ''}
                          </Text> */}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>
        )}

        {/* Modal for product details & deletion */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={!!selectedProduct}
          onRequestClose={() => setSelectedProduct(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              {/* Wrap details in a ScrollView to allow scrolling if needed */}
              {selectedProduct && (
                <ScrollView showsVerticalScrollIndicator={false}>
                  {/* Display product_name instead of name */}
                  <Text style={styles.modalTitle}>
                    {selectedProduct.product_name || 'Unnamed Product'}
                  </Text>

                  {/* Show key fields */}
                  <Text style={styles.modalText}>
                    Functionality: {selectedProduct.functionality}
                  </Text>
                  <Text style={styles.modalText}>
                    Footprint: {selectedProduct.footprint || 'N/A'}
                  </Text>
                  {/* Optionally show date_dadded */}
                  {/* <Text style={styles.modalText}>
                    Date Added: {selectedProduct.date_dadded_js?.toLocaleString() || 'N/A'}
                  </Text> */}

                  {/* Display other fields if they exist */}
                  {Object.keys(selectedProduct).map((key) => {
                    // skip known ones so we don't repeat them
                    if (
                      [
                        'id',
                        'product_name',
                        'functionality',
                        'footprint',
                        'footprintValue',
                        'date_dadded',
                        'date_dadded_js',
                      ].includes(key)
                    ) {
                      return null;
                    }
                    return (
                      <Text style={styles.modalText} key={key}>
                        {key}: {String(selectedProduct[key])}
                      </Text>
                    );
                  })}

                  {/* Buttons */}
                  <View style={styles.modalButtonRow}>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.deleteButton]}
                      onPress={handleDeleteProduct}
                    >
                      <Text style={styles.modalButtonText}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={() => setSelectedProduct(null)}
                    >
                      <Text style={styles.modalButtonText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Home;

const styles = StyleSheet.create({
  /* Background / container */
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    paddingTop: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#fff',
  },

  /* Chart area */
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

  /* Functionality sections */
  functionalitySection: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  funcHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  funcHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  expandCollapseText: {
    fontSize: 18,
    color: '#fff',
  },
  productList: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  productItem: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#555',
  },
  productItemText: {
    color: '#fff',
    fontSize: 14,
  },

  /* Modal styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 16,
    maxHeight: '80%', // limit to 80% of screen height
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    color: '#fff',
    marginVertical: 2,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  modalButton: {
    backgroundColor: '#555',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  deleteButton: {
    backgroundColor: '#d9534f', // red
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});

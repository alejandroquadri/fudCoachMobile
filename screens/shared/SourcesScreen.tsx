import React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { COLORS, SharedStyles } from '@theme';
import { Icon, Text } from '@rneui/themed';

export const SourcesScreen = () => {
  const styles = SharedStyles();
  const navigation = useNavigation();

  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error('Failed to open url', err));
  };

  const onBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity onPress={onBack}>
            <Icon
              name="chevron-left"
              type="feather"
              size={28}
              color={COLORS.primaryColor}
            />
          </TouchableOpacity>
        </View>
        <Text style={sourcesStyles.title}>Methodology and sources</Text>
      </View>

      <View style={sourcesStyles.content}>
        {/* <Text style={sourcesStyles.title}>Methodology and sources</Text> */}

        <Text style={sourcesStyles.sectionTitle}>
          How your daily calorie target is calculated
        </Text>
        <Text style={sourcesStyles.paragraph}>
          FoodCoach estimates your nutrition targets using well established,
          publicly available nutrition formulas. These methods are commonly used
          in general wellness contexts and are not intended for medical
          diagnosis or treatment.
        </Text>
        <Text style={sourcesStyles.paragraph}>
          1. Basal Metabolic Rate (BMR){'\n'}
          We estimate your BMR with the Mifflin St Jeor equation. This equation
          uses your age, sex, height and weight to estimate how much energy your
          body requires at rest.
        </Text>
        <Text style={sourcesStyles.paragraph}>
          2. Total Daily Energy Expenditure (TDEE){'\n'}
          TDEE adjusts your BMR based on your selected activity level. This
          gives an estimate of the calories needed to maintain your current
          weight.
        </Text>
        <Text style={sourcesStyles.paragraph}>
          3. Daily calorie goal{'\n'}
          If you choose a weight loss goal, FoodCoach applies a moderate daily
          calorie reduction. The size of the reduction is based on your weekly
          weight loss target and on the common assumption that about 7700
          kilocalories correspond to one kilogram of body weight. The app does
          not recommend extreme calorie deficits or therapeutic diets.
        </Text>

        <Text style={sourcesStyles.sectionTitle}>
          How your macronutrient targets are calculated
        </Text>
        <Text style={sourcesStyles.paragraph}>
          Your carbohydrate, protein and fat goals are based on general wellness
          recommendations that fall within the ranges published in public health
          guidelines.
        </Text>
        <Text style={sourcesStyles.paragraph}>
          FoodCoach uses the following distribution:{'\n'}• 50 percent
          carbohydrates{'\n'}• 30 percent protein{'\n'}• 20 percent fat
        </Text>
        <Text style={sourcesStyles.paragraph}>
          Once the calorie goal is calculated, grams are derived with standard
          energy values: four kilocalories per gram of carbohydrates, four
          kilocalories per gram of protein and nine kilocalories per gram of
          fat. These targets are intended to support balanced eating habits for
          general wellness.
        </Text>

        <Text style={sourcesStyles.sectionTitle}>Important note</Text>
        <Text style={sourcesStyles.paragraph}>
          FoodCoach provides general wellness information only. It is not a
          medical device and does not diagnose, treat or manage medical
          conditions. If you have a health condition, are pregnant, take
          medication or follow a therapeutic diet, please consult a licensed
          healthcare professional for personalised advice.
        </Text>

        <Text style={sourcesStyles.sectionTitle}>Sources and references</Text>
        <Text style={sourcesStyles.paragraph}>
          FoodCoach aligns its calculations and general nutrition guidance with
          concepts published by major public health organisations. You can learn
          more in the resources below.
        </Text>

        <TouchableOpacity
          onPress={() => openLink('https://www.dietaryguidelines.gov')}>
          <Text style={sourcesStyles.link}>
            Dietary Guidelines for Americans 2020 to 2025
          </Text>
        </TouchableOpacity>
        <Text style={sourcesStyles.linkDescription}>
          US Department of Agriculture and US Department of Health and Human
          Services
        </Text>

        <TouchableOpacity
          onPress={() =>
            openLink('https://www.ncbi.nlm.nih.gov/books/NBK56068/')
          }>
          <Text style={sourcesStyles.link}>
            Acceptable Macronutrient Distribution Ranges (AMDR)
          </Text>
        </TouchableOpacity>
        <Text style={sourcesStyles.linkDescription}>
          National Academies of Sciences, Engineering and Medicine
        </Text>

        <TouchableOpacity
          onPress={() =>
            openLink(
              'https://www.who.int/news-room/fact-sheets/detail/healthy-diet'
            )
          }>
          <Text style={sourcesStyles.link}>
            World Health Organization - Healthy diet
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            openLink('https://www.cdc.gov/healthyweight/index.html')
          }>
          <Text style={sourcesStyles.link}>
            Centers for Disease Control and Prevention - Healthy weight
          </Text>
        </TouchableOpacity>

        <Text style={sourcesStyles.sectionTitle}>
          About AI generated suggestions
        </Text>
        <Text style={sourcesStyles.paragraph}>
          The AI assistant in FoodCoach generates responses based on general
          nutrition concepts drawn from scientific literature, public health
          guidelines and wellness education resources. The assistant does not
          have a fixed, citable bibliography and does not provide medical
          advice. Please verify important health or diet decisions with
          qualified professionals.
        </Text>
      </View>
    </ScrollView>
  );
};

const sourcesStyles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
  },
  link: {
    fontSize: 15,
    fontWeight: '600',
    textDecorationLine: 'underline',
    marginTop: 8,
  },
  linkDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
});

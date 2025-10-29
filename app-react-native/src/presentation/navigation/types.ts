import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CategoryId } from '../../shared/constants/categories';

export type RootTabParamList = {
  Home: undefined;
  Search: undefined;
  Favorites: undefined;
  Settings: undefined;
  Tuner: undefined;
};

export type HomeStackParamList = {
  Categories: undefined;
  SongList: { categoryId: CategoryId; categoryName: string };
  SongDetail: { file: string; title: string; category: CategoryId };
  TextSize: undefined;
};

export type RootTabScreenProps<T extends keyof RootTabParamList> =
  BottomTabScreenProps<RootTabParamList, T>;

export type HomeStackScreenProps<T extends keyof HomeStackParamList> =
  NativeStackScreenProps<HomeStackParamList, T>;

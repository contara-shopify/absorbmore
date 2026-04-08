import type from "@total-typescript/ts-reset/filter-boolean";
import type Core from "@barba/core";
import type BarbaPrefetch from "@barba/prefetch";
import type * as Ace from "@types/ace.js";
import type * as Dayjs from "dayjs";
import type IdbKeyval from "idb-keyval";
import type { Alpine as alpine } from "alpinejs";

import type { ArticleFunctions } from "./_article-data.js";
import type { CartActions, CartStore } from "./_cart.js";
import type { CollectionFunctions } from "./_collection-data.js";
import type { initCSSAutoPrefixer } from "./_css-autoprefixer.js";
import type { InitLayoutEffects } from "./_layout-effects.js";
import type { MediaGalleryStore } from "./_media-gallery.js";
import type { ModalStore } from "./_modals.js";
import type { PageFunctions } from "./_page-data.js";
import type { RouterStore } from "./_page-transitions.js";
import type { Pagination } from "./_pagination.js";
import type { ProductFunctions } from "./_product-data.js";
import type { QuickViewStore } from "./_quick-view.js";
import type { ScrollProgressStore } from "./_scroll-progress.js";
import type { ScrollbarFunctions } from "./_scrollbar.js";
import type { InitTabs, TabStore } from "./_tabs.js";
import type { TextareaFunctions } from "./_textarea.js";
import type { ToastStore } from "./_toast.js";
import type { TooltipStore } from "./_tooltip.js";
import type { Utils } from "./_utils.js";
import type { InitVideoPlayer } from "./_video-player.js";
import type { InitCountDownTimer } from "./__block--countdown.js";
import type { InitMarqueeBar } from "./__block--marquee.js";
import type { InitParallax } from "./__block--parallax_image.js";
import type { HydrateArticleCard, InitArticleCard } from "./__section--card_article_card.js";
import type { HydrateBlogCard, InitBlogCard } from "./__section--card_blog_card.js";
import type { HydrateCollectionCard, InitCollectionCard } from "./__section--card_collection_card.js";
import type { HydrateCommentCard, InitCommentCard } from "./__section--card_comment_card.js";
import type { HydrateLineItemCard, InitLineItemCard } from "./__section--card_line_item_card.js";
import type { HydratePageCard, InitPageCard } from "./__section--card_page_card.js";
import type { HydrateProductCard, InitProductCard } from "./__section--card_product_card.js";
import type { InitNavigationBar } from "./__section--header_navigation_bar.js";
import type { InitMainArticle } from "./__section--main_article.js";
import type { InitMainBlog } from "./__section--main_blog.js";
import type { InitMainCollection } from "./__section--main_collection.js";
import type { InitMainListCollections } from "./__section--main_list_collections.js";
import type { InitMainProduct, MainProductStore } from "./__section--main_product.js";
import type { InitMainSearch } from "./__section--main_search.js";
import type { InitBackInStock } from "./__section--modal_back_in_stock_notification.js";
import type { InitSearchModal } from "./__section--modal_search.js";
import type { InitBundle } from "./__section--bundle.js";
import type { InitColorWheel } from "./__section--color_wheel.js";
import type { InitHotspots } from "./__section--hotspots.js";
import type { SettingsSchema } from "./_settings.js";
import type { _Article_liquid, _Blog_liquid, _Collection_liquid, _Media_liquid, _Page_liquid, _Product_liquid, _Variant_liquid } from "./_shopify.js";

export type ShopRoutes = {
  account_addresses_url: string;
  account_login_url: string;
  account_logout_url: string;
  account_recover_url: string;
  account_register_url: string;
  account_url: string;
  all_products_collection_url: string;
  cart_add_url: string;
  cart_change_url: string;
  cart_clear_url: string;
  cart_update_url: string;
  cart_url: string;
  collections_url: string;
  predictive_search_url: string;
  product_recommendations_url: string;
  root_url: string;
  search_url: string;
  file_url: string;
  asset_url: string;
};

export type ShopifyType = {
  designMode?: boolean;
  visualPreviewMode?: boolean;
  editor?: {
    select_block_id?: string;
    select_section_id?: string;
    deselect_block_id?: string;
    deselect_section_id?: string;
    reorder_section_id?: string;
    load_section_id?: string;
    unload_section_id?: string;
    inspector?: boolean;
  };
  OptionSelectors: (selector: string, options: any) => void;
  cdnHost: string;
  country: string;
  currency: {
    active: string;
    rate: string;
  };
  formatMoney: (price: number, format?: string) => string;
  image: object;
  locale: string;
  modules: boolean;
  money_format: string;
  paymentButton: object;
  routes: {
    root: string;
  };
  shop: string;
  theme: {
    handle: string;
    id: number;
    name: string;
    role: string;
    style: {
      handle?: any;
      id?: any;
    };
    theme_store_id: number;
  };

  analytics: {
    replayQueue: any[];
  };
  featureAssets: {
    "shop-js": object;
  };
  recaptchaV3: {
    siteKey: string;
  };
  PaymentButton: {
    version: string;
    init: () => void;
  };
};

export type CartError = {
  status: number;
  message: string;
  description: string;
};
export type CartJson = {
  token: string;
  note: string;
  attributes: { [T: string]: string };
  original_total_price: number;
  original_pre_selling_plan_total_price: number;
  total_price: number;
  discount_codes?: {
    code: string;
    applicable: boolean;
  }[];
  total_discount: number;
  total_weight: number;
  item_count: number;
  items: LineItem[];
  requires_shipping: boolean;
  currency: string;
  items_subtotal_price: number;
  cart_level_discount_applications: {
    amount: number;
    discount_application: {
      allocation_method: string;
      created_at: string;
      description: string;
      key: string;
      target_selection: string;
      target_type: string;
      title: string;
      total_allocated_amount: number;
      type: string;
      value: string;
      value_type: string;
    };
  }[];
  selling_plan_discount_applications: { name: string; value: number }[];
  sections: {
    data_cart_json: string;
  };
};

export type CartJsonChange = {
  product_id: number;
  variant_id: number;
  id: number;
  image: string;
  price: string;
  presentment_price: number;
  quantity: number;
  title: string;
  vendor: string;
  product_type: string;
  sku: string;
  untranslated_product_title: string;
  untranslated_variant_title: string;
  view_key: string;
};

export type CartJsonChanges = {
  items_added: CartJsonChange[];
  items_removed: CartJsonChange[];
};

export type LineItem = {
  id: number;
  properties?: any;
  quantity: number;
  variant_id: number;
  key: string;
  title: string;
  price: number;
  original_price: number;
  presentment_price: number;
  discounted_price: number;
  line_price: number;
  original_line_price: number;
  total_discount: number;
  discounts: { amount: number; title: string }[];
  sku: string;
  grams: number;
  vendor: string;
  taxable: boolean;
  product_id: number;
  product_has_only_default_variant: boolean;
  gift_card: boolean;
  final_price: number;
  final_line_price: number;
  url: string;
  featured_image: {
    aspect_ratio: number;
    alt: string;
    height: number;
    url: string;
    width: number;
  };
  image: string;
  handle: string;
  requires_shipping: boolean;
  product_type: string;
  product_title: string;
  product_description: string;
  variant_title: string;
  variant_options: string[];
  options_with_values: {
    name: string;
    value: string;
  }[];
  line_level_discount_allocations: {
    amount: number;
    discount_application: {
      allocation_method: string;
      created_at: string;
      description: string;
      key: string;
      target_selection: string;
      target_type: string;
      title: string;
      total_allocated_amount: number;
      type: string;
      value: string;
      value_type: string;
    };
  }[];
  line_level_total_discount: number;
  selling_plan_allocation: LineItem_SellingPlanAllocation;
  item_components: Omit<LineItem, "item_components">[];
  parent_relationship?: {
    parent_key: string;
  };
  index: number;
};

export type LineItem_SellingPlanAllocation = {
  price_adjustments: {
    position: number;
    price: number;
  }[];
  price: number;
  compare_at_price: number;
  per_delivery_price: number;
  selling_plan: LineItem_SellingPlan;
};

export type LineItem_SellingPlan = {
  id: number;
  name: string;
  description?: any;
  options: {
    name: string;
    position: number;
    value: string;
  }[];
  recurring_deliveries: boolean;
  fixed_selling_plan: boolean;
  price_adjustments: {
    order_count?: any;
    position: number;
    value_type: string;
    value: number;
  }[];
};

export type _Product_hydrated = Omit<_Product_liquid, "variants"> & {
  _full_data?: boolean;
  _recommendations_loaded_at: number;
  _updated_at: number;
  recommendation_params?: string;
  selected_or_first_available_variant_id?: number;
  selected_variant_id?: number;
  related_products?: _Product_hydrated[];
  related_product_handles?: string[];
  complementary_products?: _Product_hydrated[];
  complementary_product_handles?: string[];
  variants: _Variant_hydrated[];
};

export type _Variant_hydrated = _Variant_liquid & {
  preorder?: boolean;
  preorder_date?: string;
  preorder_quantity?: number;
  metafields: {
    smart?: {
      images?: _Media_liquid[];
      variant_images?: _Media_liquid[];
      color_swatch?: string | _Media_liquid;
    };
  };
};

declare module "alpinejs" {
  export interface Alpine {
    watch<T>(getter: () => T, callback: (value: T, oldValue: T) => void): () => void;

    watch(path: string, callback: (value: unknown, oldValue: unknown) => void): () => void;
  }
}

declare global {
  let Shopify: ShopifyType;
  let _stores: {
    toast: ToastStore;
    modal: ModalStore;
    tooltip: TooltipStore;
    router: RouterStore;
    cart: CartStore;
    backInStockNotification: ReturnType<InitBackInStock>["back_in_stock"];
    main_product: MainProductStore;
    mediaGallery: MediaGalleryStore;
    quickView: QuickViewStore;
    scrollProgress: ScrollProgressStore;
    tabs: TabStore;
  };
  let _sections: {
    initProduct: InitMainProduct;
    initMainProduct: InitMainProduct;
    initProductCard: InitProductCard;
    hydrateProductCard: HydrateProductCard;
    initArticleCard: InitArticleCard;
    hydrateArticleCard: HydrateArticleCard;
    initBlogCard: InitBlogCard;
    hydrateBlogCard: HydrateBlogCard;
    initLineItemCard: InitLineItemCard;
    hydrateLineItemCard: HydrateLineItemCard;
    initCollectionCard: InitCollectionCard;
    hydrateCollectionCard: HydrateCollectionCard;
    initPageCard: InitPageCard;
    initCommentCard: InitCommentCard;
    hydratePageCard: HydratePageCard;
    hydrateCommentCard: HydrateCommentCard;
    initNavigationBar: InitNavigationBar;
    initMarqueeBar: InitMarqueeBar;
    initSearchModal: InitSearchModal;
    initMainCollection: InitMainCollection;
    initMainListCollections: InitMainListCollections;
    initMainBlog: InitMainBlog;
    initMainArticle: InitMainArticle;
    initMainSearch: InitMainSearch;
    initParallax: InitParallax;
    initColorWheel: InitColorWheel;
    initCountDownTimer: InitCountDownTimer;
    initBundle: InitBundle;
    initBackInStock: InitBackInStock;
    initLayoutEffects: InitLayoutEffects;
    initHotspots: InitHotspots;
    initTabs: InitTabs;
    initVideoPlayer: InitVideoPlayer;
  } & {
    [T: string]: { [T: string]: any };
  };
  let _products: { [handle: string]: _Product_hydrated };
  let _fetch_products: Map<string, Promise<_Product_hydrated>>;
  let _cached_products: Map<string, Promise<_Product_hydrated>>;
  let _save_product_sequence: Map<string, number>;
  let _save_product_schedule: Set<string>;

  let _recent_products: [string, number][];
  let _product: ProductFunctions;
  let _collection: CollectionFunctions;
  let _article: ArticleFunctions;
  let _page: PageFunctions;
  let _scrollbar: ScrollbarFunctions;
  let _pagination: Pagination;
  let _collections: { [handle: string]: _Collection_liquid };
  let _pages: { [handle: string]: _Page_liquid };
  let _blogs: { [handle: string]: _Blog_liquid };
  let _comments: { [id: string]: _Blog_liquid };
  let _articles: { [handle: string]: _Article_liquid };
  let _metaobjects: { [handle: string]: any };
  let _cart: CartActions;
  let _cart_data: CartJson;
  let utils: Utils;
  let clsx: Utils["clsx"];
  let barba: typeof Core;
  let ace: typeof Ace;
  let barbaPrefetch: typeof BarbaPrefetch;
  let idbKeyval: typeof IdbKeyval;
  let Alpine: alpine;
  let dayjs: Dayjs;

  interface Window {
    Alpine: alpine;
    dayjs: Dayjs;
    modalsLoaded: boolean;
    customer?: {
      id: number;
      email: string;
      first_name: string;
      last_name: string;
      has_account: boolean;
      name: string;
      orders_count: number;
      phone?: string;
      tags: string[];
      total_spent: number;
    } | null;
    _cart_data: typeof _cart_data;
    _cart: typeof _cart;
    _scrollbar: typeof _scrollbar;
    _textarea: TextareaFunctions;
    _pagination: typeof _pagination;
    _product: typeof _product;
    _collection: typeof _collection;
    _page: typeof _page;
    _article: typeof _article;
    _products: typeof _products;
    _cached_products: typeof _cached_products;
    _fetch_products: typeof _fetch_products;
    _save_product_sequence: typeof _save_product_sequence;
    _save_product_schedule: typeof _save_product_schedule;
    _collections: typeof _collections;
    _pages: typeof _pages;
    _blogs: typeof _blogs;
    _articles: typeof _articles;
    _sections: typeof _sections;
    _stores: typeof _stores;
    _dynamic_modules: { key: string; module: string; test: RegExp }[];
    initCSSAutoPrefixer: typeof initCSSAutoPrefixer;
    _quiz: { [T: string]: any; products: _Product_hydrated[] };
    _bundle_auto_add_items: { product: _Product_hydrated; variant: _Variant_hydrated[] }[];
    _learnq: any;
    utils: typeof Utils;
    sectionContent: {
      current: any;
    };
    initDeferredComponents: (target?: HTMLElement) => void;
    Shopify: typeof Shopify;
    barba: typeof barba;
    ace?: typeof Ace;
    idbKeyval: typeof IdbKeyval;
    clsx: typeof clsx;
    _recent_products: typeof _recent_products;
    google: any;
    collection?: _Collection_liquid;
    routes: ShopRoutes;
    template: string;
    theme_settings: SettingsSchema;
    wait_for_cache_bust?: boolean;
    design_mode: boolean;
    page_transitions_enabled?: boolean;
    page_transitions_ignore?: string[];
    money_format: string;
    okeWidgetApi?: {
      initAllWidgets?: () => void;
    };
    yotpoWidgetsContainer?: {
      initWidgets?: () => void;
    };
    loyaltylion?: {
      ui?: {
        refresh?: () => void;
      };
    };
    event?: Omit<Event, "barba_redirect"> & { barba_redirect?: boolean };
    YT: YT;
    _youtube_initialized?: boolean;
    onYouTubeIframeAPIReady: () => void;
    clearCache: () => Promise<void>;
  }

  interface InputHTMLAttributes {
    autocomplete?: InputAutocomplete;
  }
}

export type InputAutocomplete =
  | "off"
  | "name"
  | "honorific-prefix"
  | "given-name"
  | "additional-name"
  | "family-name"
  | "honorific-suffix"
  | "nickname"
  | "email"
  | "username"
  | "new-password"
  | "current-password"
  | "one-time-code"
  | "organization-title"
  | "organization"
  | "street-address"
  | "address-line1"
  | "address-line2"
  | "address-line3"
  | "address-level4"
  | "address-level3"
  | "address-level2"
  | "address-level1"
  | "country"
  | "country-name"
  | "postal-code"
  | "cc-name"
  | "cc-given-name"
  | "cc-additional-name"
  | "cc-family-name"
  | "cc-number"
  | "cc-exp"
  | "cc-exp-month"
  | "cc-exp-year"
  | "cc-csc"
  | "cc-type"
  | "transaction-currency"
  | "transaction-amount"
  | "language"
  | "bday"
  | "bday-day"
  | "bday-month"
  | "bday-year"
  | "sex"
  | "tel"
  | "tel-country-code"
  | "tel-national"
  | "tel-area-code"
  | "tel-local"
  | "tel-extension"
  | "impp"
  | "url"
  | "photo";

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '../lib/supabase';

interface VideoFile {
  id: string;
  name: string;
  title: string;
  description: string;
  url: string;
  video_type: 'file' | 'url' | 'youtube';
  youtube_id?: string;
  created_at: string;
}

interface PhotoFile {
  id: string;
  name: string;
  title: string;
  url: string;
  created_at: string;
}

const SUPABASE_URL = 'https://qkvgjrywutnudwcoekmf.supabase.co';

interface VideoData {
  video_type: 'file' | 'url' | 'youtube';
  youtube_id?: string;
  video_url?: string;
  filename?: string;
}

// Get video URL based on type
function getVideoUrl(video: VideoData): string {
  switch (video.video_type) {
    case 'youtube':
      return `https://www.youtube.com/embed/${video.youtube_id || ''}`;
    case 'url':
      return video.video_url || '';
    case 'file':
    default:
      return `${SUPABASE_URL}/storage/v1/object/public/video/${encodeURIComponent(video.filename || '')}`;
  }
}

// Get YouTube thumbnail
function getYouTubeThumbnail(youtubeId: string): string {
  return `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;
}

// Thumbnail component for the sidebar (videos)
function VideoThumbnail({ 
  video, 
  isSelected, 
  onClick 
}: { 
  video: VideoFile; 
  isSelected: boolean;
  onClick: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isYouTube = video.video_type === 'youtube';

  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer rounded-xl transition-all duration-300 border-2 ${
        isSelected 
          ? 'border-amber-500 shadow-lg bg-amber-50' 
          : 'border-transparent hover:border-amber-300 hover:shadow-md bg-white'
      }`}
    >
      {/* Video thumbnail */}
      <div className="relative aspect-video bg-gray-900 rounded-t-lg overflow-hidden">
        {isYouTube && video.youtube_id ? (
          <img
            src={getYouTubeThumbnail(video.youtube_id)}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            src={video.url}
            className="w-full h-full object-cover"
            muted
            preload="metadata"
            onMouseEnter={() => !isYouTube && videoRef.current?.play()}
            onMouseLeave={() => {
              if (!isYouTube && videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
              }
            }}
          />
        )}
        
        {/* Overlay */}
        <div className={`absolute inset-0 transition-opacity duration-300 ${
          isSelected ? 'bg-amber-500/10' : 'bg-black/20 group-hover:bg-black/5'
        }`} />
        
        {/* Play icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
            isYouTube 
              ? (isSelected ? 'bg-red-500 scale-100' : 'bg-red-500/80 scale-90 group-hover:scale-100')
              : (isSelected ? 'bg-amber-500 scale-100' : 'bg-white/40 scale-90 group-hover:scale-100 group-hover:bg-white/60')
          }`}>
            {isYouTube ? (
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            ) : (
              <svg className="w-5 h-5 ml-0.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </div>
        </div>
        
        {/* Type badge */}
        {isYouTube && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded font-medium">
            YT
          </div>
        )}
        
        {/* Selected indicator */}
        {isSelected && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded font-medium shadow">
            ▶ Сейчас
          </div>
        )}
      </div>
      
      {/* Title */}
      <div className="p-3">
        <h4 className={`font-medium text-sm ${isSelected ? 'text-amber-700' : 'text-gray-800'}`}>
          {video.title}
        </h4>
        {video.description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{video.description}</p>
        )}
      </div>
    </div>
  );
}

// Photo thumbnail component
function PhotoThumbnail({ 
  photo, 
  isSelected, 
  onClick 
}: { 
  photo: PhotoFile; 
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer rounded-xl transition-all duration-300 border-2 ${
        isSelected 
          ? 'border-amber-500 shadow-lg bg-amber-50' 
          : 'border-transparent hover:border-amber-300 hover:shadow-md bg-white'
      }`}
    >
      {/* Photo thumbnail */}
      <div className="relative aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
        <Image
          src={photo.url}
          alt={photo.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        
        {/* Overlay */}
        <div className={`absolute inset-0 transition-opacity duration-300 ${
          isSelected ? 'bg-amber-500/10' : 'bg-black/10 group-hover:bg-black/0'
        }`} />
        
        {/* Selected indicator */}
        {isSelected && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded font-medium shadow">
            ✓ Выбрано
          </div>
        )}
        
        {/* Zoom icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Title */}
      <div className="p-3">
        <h4 className={`font-medium text-sm ${isSelected ? 'text-amber-700' : 'text-gray-800'}`}>
          {photo.title}
        </h4>
      </div>
    </div>
  );
}

export default function WorksPage() {
  const [viewMode, setViewMode] = useState<'video' | 'photo'>('video');
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [photos, setPhotos] = useState<PhotoFile[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoFile | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const mainVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function fetchMedia() {
      try {
        setLoading(true);
        
        // Fetch videos from database
        const { data: dbVideos } = await supabase
          .from('videos')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });
        
        if (dbVideos && dbVideos.length > 0) {
          const videoFiles: VideoFile[] = dbVideos.map(video => ({
            id: video.id,
            name: video.filename,
            title: video.title,
            description: video.description || '',
            url: getVideoUrl(video),
            video_type: video.video_type || 'file',
            youtube_id: video.youtube_id,
            created_at: video.created_at
          }));
          setVideos(videoFiles);
          setSelectedVideo(videoFiles[0]);
        } else {
          // Fallback videos
          const knownVideoFiles = [
            { title: 'Проект 1', filename: '0u9dq5fzmlad_1748104138382.mp4' },
            { title: 'Проект 2', filename: 'fa108d7pstu_1748104211093.mp4' },
            { title: 'Проект 3', filename: 'fgvgtlomy0i_1748021981959.mp4' },
            { title: 'Проект 4', filename: 'n9pmlarbaei_1748163383916.mp4' },
          ];
          
          const videoFiles: VideoFile[] = knownVideoFiles.map((v, index) => ({
            id: `fallback-${index}`,
            name: v.filename,
            title: v.title,
            description: '',
            url: `${SUPABASE_URL}/storage/v1/object/public/video/${encodeURIComponent(v.filename)}`,
            video_type: 'file' as const,
            created_at: new Date().toISOString()
          }));
          setVideos(videoFiles);
          setSelectedVideo(videoFiles[0]);
        }

        // Fetch photos from database table
        const { data: dbPhotos } = await supabase
          .from('photos')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (dbPhotos && dbPhotos.length > 0) {
          const photoItems: PhotoFile[] = dbPhotos.map(photo => ({
            id: photo.id,
            name: photo.filename,
            title: photo.title,
            url: `${SUPABASE_URL}/storage/v1/object/public/products_img/${encodeURIComponent(photo.filename)}`,
            created_at: photo.created_at
          }));
          setPhotos(photoItems);
          if (photoItems.length > 0) {
            setSelectedPhoto(photoItems[0]);
          }
        } else {
          // Fallback: try to get photos from images bucket or use placeholders
          const fallbackPhotos: PhotoFile[] = [
            { id: '1', name: 'photo1', title: 'Проект 1', url: '/img/services/IMG_9236.jpg', created_at: new Date().toISOString() },
            { id: '2', name: 'photo2', title: 'Проект 2', url: '/img/services/IMG_9370.jpg', created_at: new Date().toISOString() },
            { id: '3', name: 'photo3', title: 'Проект 3', url: '/img/services/photo_2022-11-07_15-16-02.jpg', created_at: new Date().toISOString() },
          ];
          setPhotos(fallbackPhotos);
          setSelectedPhoto(fallbackPhotos[0]);
        }
        
      } catch (err) {
        console.error('Error:', err);
        setError('Не удалось загрузить медиа');
      } finally {
        setLoading(false);
      }
    }

    fetchMedia();
  }, []);

  // Handle video selection
  const handleVideoSelect = (video: VideoFile) => {
    setSelectedVideo(video);
    setIsPlaying(false);
    if (mainVideoRef.current) {
      mainVideoRef.current.load();
    }
  };

  // Handle photo selection
  const handlePhotoSelect = (photo: PhotoFile) => {
    setSelectedPhoto(photo);
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (mainVideoRef.current) {
      if (isPlaying) {
        mainVideoRef.current.pause();
      } else {
        mainVideoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const currentItems = viewMode === 'video' ? videos : photos;
  const itemCount = currentItems.length;

  return (
    <div className="bg-gradient-to-b from-[#F5F7FA] to-[#EFF6FF] min-h-screen">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#ECF0F1] to-[#F8F9FA]/50 opacity-70"></div>
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-50/70 rounded-full opacity-40 blur-3xl -translate-x-1/3 -translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-20 sm:px-6 lg:px-8 relative">
          <div className="text-center relative">
            <div className="inline-block mx-auto mb-4">
              <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-500 mx-auto mb-1 rounded-full"></div>
              <div className="w-10 h-1 bg-gradient-to-r from-amber-400 to-amber-500 mx-auto rounded-full"></div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl tracking-tight">
              <span className="inline-block border-b-2 border-amber-400 pb-2">Наши работы</span>
            </h1>
            <p className="mt-5 max-w-2xl mx-auto text-base text-gray-600 leading-relaxed">
              Галерея выполненных проектов. Выберите фото или видео для просмотра.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-20 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Загрузка...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-xl text-gray-600">{error}</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Media Player - Left Side */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Media Container */}
                <div className="relative aspect-video bg-gray-900">
                  {viewMode === 'video' ? (
                    // Video player
                    selectedVideo && (
                      <>
                        {selectedVideo.video_type === 'youtube' ? (
                          <iframe
                            src={`${selectedVideo.url}?autoplay=0&rel=0`}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <>
                            <video
                              ref={mainVideoRef}
                              src={selectedVideo.url}
                              className="w-full h-full object-contain"
                              controls
                              onPlay={() => setIsPlaying(true)}
                              onPause={() => setIsPlaying(false)}
                              onEnded={() => setIsPlaying(false)}
                            />
                            
                            {/* Custom overlay when not playing */}
                            {!isPlaying && (
                              <div 
                                className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 flex items-center justify-center cursor-pointer group"
                                onClick={togglePlay}
                              >
                                <div className="w-20 h-20 rounded-full bg-amber-500/90 flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-500 shadow-lg shadow-amber-500/30">
                                  <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z"/>
                                  </svg>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </>
                    )
                  ) : (
                    // Photo viewer
                    selectedPhoto && (
                      <div className="relative w-full h-full">
                        <Image
                          src={selectedPhoto.url}
                          alt={selectedPhoto.title}
                          fill
                          className="object-contain"
                          sizes="(max-width: 1024px) 100vw, 66vw"
                          priority
                        />
                      </div>
                    )
                  )}
                </div>
                
                {/* Media Info */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {viewMode === 'video' 
                        ? (selectedVideo?.title || 'Выберите видео')
                        : (selectedPhoto?.title || 'Выберите фото')
                      }
                    </h2>
                    {viewMode === 'video' && selectedVideo?.video_type === 'youtube' && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full font-medium">
                        YouTube
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600">
                    {viewMode === 'video' 
                      ? (selectedVideo?.description || 'Выберите видео из списка справа для просмотра')
                      : 'Выберите фото из списка справа для просмотра'
                    }
                  </p>
                </div>
              </div>
            </div>
            
            {/* Media List - Right Side */}
            <div className="lg:w-1/3 flex flex-col">
              <div className="bg-white rounded-2xl shadow-lg p-4 flex-1 flex flex-col">
                {/* Toggle Buttons */}
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                  <div className="flex bg-gray-100 rounded-lg p-1 flex-1">
                    <button
                      onClick={() => setViewMode('photo')}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        viewMode === 'photo'
                          ? 'bg-amber-500 text-white shadow-md'
                          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Фото
                    </button>
                    <button
                      onClick={() => setViewMode('video')}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        viewMode === 'video'
                          ? 'bg-amber-500 text-white shadow-md'
                          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Видео
                    </button>
                  </div>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
                    {itemCount} {viewMode === 'video' ? 'видео' : 'фото'}
                  </span>
                </div>
                
                {/* Scrollable media list */}
                <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar" style={{ maxHeight: 'calc(56.25vw * 0.66 - 40px)', minHeight: '400px' }}>
                  {viewMode === 'video' ? (
                    videos.length > 0 ? (
                      videos.map((video) => (
                        <VideoThumbnail
                          key={video.id}
                          video={video}
                          isSelected={selectedVideo?.id === video.id}
                          onClick={() => handleVideoSelect(video)}
                        />
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <p>Видео пока нет</p>
                      </div>
                    )
                  ) : (
                    photos.length > 0 ? (
                      photos.map((photo) => (
                        <PhotoThumbnail
                          key={photo.id}
                          photo={photo}
                          isSelected={selectedPhoto?.id === photo.id}
                          onClick={() => handlePhotoSelect(photo)}
                        />
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p>Фото пока нет</p>
                      </div>
                    )
                  )}
                </div>
              </div>
              
              {/* CTA */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link
                  href="/contacts"
                  className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-md hover:shadow-lg"
                >
                  <span>Связаться с нами</span>
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
}

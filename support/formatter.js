module.exports = (data) => {
    sample = {
        General_data: {
            nb_streamss: data.format.nb_streamss,
            nb_programs: data.format.nb_programs,
            format_long_name: data.format.format_long_name,
            start_time: data.format.start_time,
            duration: data.format.duration / 60,
            size: data.format.size / 1000000,
            bit_rate: data.format.bit_rate / 1000,
            probe_score: data.format.probe_score,
            tags: {
                "encoder": data.format.tags["encoder"],
                "creation_time": data.format.tags["creation_time"],
            }
        },
        Video: {
            codec_name: data.streams[0].codec_name,
            codec_long_name: data.streams[0].codec_long_name,
            profile: data.streams[0].profile,
            codec_type: data.streams[0].codec_type,
            codec_tag_string: data.streams[0].codec_tag_string,
            codec_tag: data.streams[0].codec_tag,
            width: data.streams[0].width,
            height: data.streams[0].height,
            coded_width: data.streams[0].coded_width,
            coded_height: data.streams[0].coded_height,
            closed_captions: data.streams[0].closed_captions,
            film_grain: data.streams[0].film_grain,
            has_b_frames: data.streams[0].has_b_frames,
            sample_aspect_ratio: data.streams[0].sample_aspect_ratio,
            display_aspect_ratio: data.streams[0].display_aspect_ratio,
            pix_fmt: data.streams[0].pix_fmt,
            level: data.streams[0].level,
            color_range: data.streams[0].color_range,
            color_space: data.streams[0].color_space,
            color_transfer: data.streams[0].color_transfer,
            color_primaries: data.streams[0].color_primaries,
            chroma_location: data.streams[0].chroma_location,
            field_order: data.streams[0].field_order,
            refs: data.streams[0].refs,
            id: data.streams[0].id,
            r_frame_rate: data.streams[0].r_frame_rate,
            avg_frame_rate: data.streams[0].avg_frame_rate,
            time_base: data.streams[0].time_base,
            start_pts: data.streams[0].start_pts,
            start_time: data.streams[0].start_time,
            duration_ts: data.streams[0].duration_ts,
            duration: data.streams[0].duration / 60,
            bit_rate: data.streams[0].bit_rate / 1000,
            max_bit_rate: data.streams[0].max_bit_rate,
            bits_per_raw_sample: data.streams[0].bits_per_raw_sample,
            nb_frames: data.streams[0].nb_frames,
            nb_read_frames: data.streams[0].nb_read_frames,
            nb_read_packets: data.streams[0].nb_read_frames,
            extradata_size: data.streams[0].extradata_size,
            tags: {
                "Writing application": data.streams[0].tags["Writing application"],
                "Writing library": data.streams[0].tags["Writing library"],
            },
            disposition: {
                "default": data.streams[0].disposition["default"],
                "dub": data.streams[0].disposition["dub"],
                "original": data.streams[0].disposition["original"],
                "comment": data.streams[0].disposition["comment"],
                "lyrics": data.streams[0].disposition["lyrics"],
                "karaoke": data.streams[0].disposition["karaoke"],
                "forced": data.streams[0].disposition["forced"],
                "hearing_impaired": data.streams[0].disposition["hearing_impaired"],
                "visual_impaired": data.streams[0].disposition["visual_impaired"],
                "clean_effects": data.streams[0].disposition["clean_effects"],
                "attached_pic": data.streams[0].disposition["attached_pic"],
                "timed_thumbnails": data.streams[0].disposition["timed_thumbnails"],
                "non_diegetic": data.streams[0].disposition['non_diegetic'],
                "captions": data.streams[0].disposition['captions'],
                "descriptions": data.streams[0].disposition['descriptions'],
                "metadata": data.streams[0].disposition['metadata'],
                "dependent": data.streams[0].disposition['dependent'],
                "still_image": data.streams[0].disposition['still_image']
            }
        },
        Audio: {
            codec_name: data.streams[1].codec_name,
            codec_long_name: data.streams[1].codec_long_name,
            profile: data.streams[1].profile,
            codec_type: data.streams[1].codec_type,
            codec_tag_string: data.streams[1].codec_tag_string,
            codec_tag: data.streams[1].codec_tag,
            sample_fmt: data.streams[1].sample_fmt,
            sample_rate: data.streams[1].sample_rate,
            channels: data.streams[1].channels,
            channel_layout: data.streams[1].channel_layout,
            bits_per_sample: data.streams[1].bits_per_sample,
            initial_padding: data.streams[1].initial_padding,
            id: data.streams[1].id,
            r_frame_rate: data.streams[1].r_frame_rate,
            avg_frame_rate: data.streams[1].avg_frame_rate,
            time_base: data.streams[1].time_base,
            start_pts: data.streams[1].start_pts,
            start_time: data.streams[1].start_time,
            duration_ts: data.streams[1].duration_ts,
            duration: data.streams[1].duration / 60,
            bit_rate: data.streams[1].bit_rate / 1000,
            max_bit_rate: data.streams[1].max_bit_rate,
            bits_per_raw_sample: data.streams[1].bits_per_raw_sample,
            nb_frames: data.streams[1].nb_frames,
            nb_read_frames: data.streams[1].nb_read_frames,
            nb_read_packets: data.streams[1].nb_read_frames,
            extradata_size: data.streams[1].extradata_size,
            tags: { "language": data.streams[1].tags["language"] },
            disposition: {
                "default": data.streams[1].disposition["default"],
                "dub": data.streams[1].disposition["dub"],
                "original": data.streams[1].disposition["original"],
                "comment": data.streams[1].disposition["comment"],
                "lyrics": data.streams[1].disposition["lyrics"],
                "karaoke": data.streams[1].disposition["karaoke"],
                "forced": data.streams[1].disposition["forced"],
                "hearing_impaired": data.streams[1].disposition["hearing_impaired"],
                "visual_impaired": data.streams[1].disposition["visual_impaired"],
                "clean_effects": data.streams[1].disposition["clean_effects"],
                "attached_pic": data.streams[1].disposition["attached_pic"],
                "timed_thumbnails": data.streams[1].disposition["timed_thumbnails"],
                "non_diegetic": data.streams[1].disposition['non_diegetic'],
                "captions": data.streams[1].disposition['captions'],
                "descriptions": data.streams[1].disposition['descriptions'],
                "metadata": data.streams[1].disposition['metadata'],
                "dependent": data.streams[1].disposition['dependent'],
                "still_image": data.streams[1].disposition['still_image']
            }
        }
    }
    return sample
}